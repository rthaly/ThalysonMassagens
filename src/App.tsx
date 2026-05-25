import React, { useState, useEffect, useMemo, useRef, useCallback, memo } from 'react';

// ==================================================================================
// DESIGN TOKENS & CONFIG
// ==================================================================================
const CONFIG = {
  PHONE: "5517991360413",
  INSTAGRAM_URL: "https://instagram.com/thalyson.massagens",
  STORAGE_KEY: '@thaly_app_v30_responsive_a11y',
  PIX_KEY: "62.922.530/0001-14",
  LOCALE_PT: 'pt-BR',
  LOCALE_EN: 'en-US',
  EXCHANGE_RATE: 5.0,
  SECRET_TOKEN: 'THALY_SECURE_V10',
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
};

// ==================================================================================
// GLOBAL STYLES (A11y, Typography and Flex/Grid Responsiveness)
// ==================================================================================
const GlobalStyles = memo(({ isDark }: { isDark: boolean }) => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

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
      --c-text-muted: ${isDark ? '#a1a1aa' : '#52525b'};
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
      line-height: 1.6;
      font-size: 16px; 
    }

    h1, h2, h3, h4, h5, h6 { font-weight: 600; letter-spacing: -0.01em; }
    .font-display { font-family: var(--font-display); font-weight: 600; }

    /* Focus Rings for Keyboard Accessibility */
    *:focus-visible { outline: 2px solid var(--c-blue); outline-offset: 4px; }

    /* Scrollbar */
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--c-border); border-radius: 4px; }

    /* Animations */
    @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleIn { from { transform: scale(0.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    @keyframes checkPop { 0% { transform: scale(0); } 60% { transform: scale(1.15); } 100% { transform: scale(1); } }
    @keyframes toast-in { from { transform: translateY(-20px) scale(0.94); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
    @keyframes modal-backdrop { from { opacity: 0; } to { opacity: 1; } }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
    @keyframes slideRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
    @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
    @keyframes loadingBar { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
    @keyframes bounceSlow { 0%, 100% { transform: translateY(-5%); } 50% { transform: translateY(0); } }
    
    .animate-fade-up { animation: fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-fade-in { animation: fadeIn 0.3s ease forwards; }
    .animate-scale-in { animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
    .animate-check-pop { animation: checkPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
    .animate-toast-in { animation: toast-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
    .animate-modal-backdrop { animation: modal-backdrop 0.3s ease-out forwards; }
    .animate-spin { animation: spin 0.7s linear infinite; }
    .animate-shake { animation: shake 0.3s cubic-bezier(.36,.07,.19,.97) both; }
    .animate-slide-right { animation: slideRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .loading-bar-anim { animation: loadingBar 1.5s infinite linear; }
    .animate-bounce-slow { animation: bounceSlow 3s infinite ease-in-out; }

    /* Interactivity */
    .card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease; }
    @media (hover: hover) { .card-hover:hover { transform: translateY(-3px); } }
    .service-card-selected { box-shadow: 0 0 0 2px var(--c-blue), 0 8px 32px rgba(59,130,246,0.12); }
    .service-card-selected-amber { box-shadow: 0 0 0 2px var(--c-amber), 0 8px 32px rgba(245,158,11,0.12); }

    button { position: relative; overflow: hidden; cursor: pointer; border: none; }
    .input-field:focus { outline: none; border-color: var(--c-blue); box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }

    /* Gradients & Utility */
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
interface BookingData { type: 'single' | 'pack'; cart: ServiceItem[]; extras: Record<string, boolean>; date: string | null; time: string | null; locationType: 'home' | 'motel' | 'hotel'; address: Address; payment: string; appliedCoupon: Coupon | null; termsAccepted: boolean; bookingId: string; mediaAllowed: boolean; }
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
    depil: 107, relax: 157, sens: 177, naturista: 197, titan: 207, reversa: 260, nuru: 317, crossfit: 187,
    pes: 110, maos: 110, combo_pm: 190,
    pack_basic: { v: 247, full: 284, save: 37 },
    pack1: { v: 297, full: 334, save: 37 },
    pack_glow: { v: 327, full: 391, save: 64 },
    pack_muscle: { v: 347, full: 408, save: 61 },
    pack2: { v: 387, full: 467, save: 80 },
    pack3: { v: 637, full: 721, save: 84 },
    pack_ultimate: { v: 657, full: 778, save: 121 },
    extras: { more_time: 77, touch: 77, aroma: 17, hair_trim: 57, pain_relief: 17, dominador: 180, oral: 120, beijos: 77, prostatico: 120 }
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
      
      { id: 'relaxante', category: 'relax', min: 40, price: p.relax, icon: "user-check", tag: isEn ? "MUSCLE RELIEF" : "ALÍVIO MUSCULAR", title: isEn ? "Classic Massage" : "Massagem Clássica", desc: isEn ? "Full body massage focused on pain relief and mental relaxation. Strictly no intimate touches." : "Massagem no corpo todo, focada em tirar dores e relaxar a mente. Atenção: rigorosamente sem toques íntimos.", details: isEn ? "1. Full body relaxing massage.\n2. Focus on releasing tension and relieving pain.\n3. Deep mental relaxation.\n4. Strictly professional session, no intimate touches." : "1. Massagem relaxante feita no corpo todo.\n2. Foco em soltar pontos de tensão e aliviar dores.\n3. Relaxamento profundo da mente e do corpo.\n4. Sessão estritamente profissional, sem toques íntimos." },
      { id: 'naturista', category: 'relax', min: 40, price: p.naturista, icon: "sun", tag: isEn ? "ZERO CLOTHES" : "ZERO ROUPAS", title: isEn ? "Naturist Classic" : "Clássica Naturista", desc: isEn ? "Starts with the Classic full-body massage. The difference is we do it without clothes for total freedom." : "Começamos com a massagem clássica no corpo todo para relaxar a mente e tirar dores. O diferencial é que fazemos tudo sem roupas para maior liberdade.", details: isEn ? "1. Classic full-body relaxing massage.\n2. Removal of all clothes for total freedom.\n3. Deep tension relief.\n4. Strictly professional session, no intimate touches." : "1. Massagem clássica relaxante no corpo todo.\n2. Remoção de todas as roupas para liberdade total.\n3. Alívio de tensões profundas nas costas e pernas.\n4. Sessão estritamente profissional, sem toques íntimos." },
      { id: 'crossfit', category: 'relax', min: 60, price: p.crossfit, icon: "zap", tag: isEn ? "DEEP RECOVERY" : "RECUPERAÇÃO", title: isEn ? "For Athletes" : "Massagem para Atletas", desc: isEn ? "Starts with the Classic massage, then applies extra pressure and techniques to recover tired muscles." : "Inicia com a massagem clássica no corpo todo. Depois, aplicamos mais força e técnicas profundas para recuperar músculos cansados.", details: isEn ? "1. Classic full-body relaxing massage.\n2. Extra pressure on painful areas.\n3. Use of muscle relief ointments.\n4. Stretching to restore mobility." : "1. Massagem clássica relaxante no corpo todo.\n2. Aplicação de força extra nas áreas mais doloridas.\n3. Uso de pomadas para alívio rápido da inflamação.\n4. Técnicas profundas e alongamentos para devolver o movimento." },
      
      { id: 'sensitiva', category: 'final', min: 60, price: p.sens, icon: "sparkles", tag: isEn ? "REDUCES ANXIETY" : "TIRA ANSIEDADE", title: isEn ? "Sensory Massage" : "Massagem Sensorial", desc: isEn ? "Classic massage first to calm the mind. Then, subtle touches to awaken senses, ending with pleasure." : "Primeiro, a massagem clássica no corpo todo para tirar dores e acalmar a mente. Em seguida, toques sutis para despertar os sentidos, finalizando com prazer.", details: isEn ? "1. Classic full-body relaxing massage.\n2. Subtle touches to calm a racing mind.\n3. Building new physical sensations.\n4. Manual ending for total stress release." : "1. Massagem clássica relaxante no corpo todo.\n2. Toques muito sutis para desligar a mente acelerada.\n3. Construção de novas sensações físicas pelo corpo.\n4. Finalização manual para liberação total de estresse." },
      { id: 'mista', category: 'final', min: 60, price: p.titan, icon: "zap", tag: isEn ? "BEST OF BOTH" : "O MELHOR DOS 2", title: isEn ? "Fusion Experience" : "Experiência Fusion", desc: isEn ? "Starts with the complete Classic massage to heal pain. Then, the rhythm changes to skin-to-skin contact." : "Inicia com a massagem clássica completa para curar as dores. Depois, o ritmo muda para contato próximo e uma finalização intensa.", details: isEn ? "1. Classic full-body relaxing massage.\n2. Close physical contact (I wear only underwear).\n3. Warming and stimulating all senses.\n4. Intense ending to recharge your energy." : "1. Massagem clássica relaxante no corpo todo.\n2. Contato físico próximo (atendo apenas de roupa íntima).\n3. Aquecimento corporal e estímulo de todos os sentidos.\n4. Finalização intensa para recarregar as energias da semana." },
      { id: 'reversa', category: 'final', min: 60, price: p.reversa, icon: "refresh-cw", tag: isEn ? "REAL CONTACT" : "CONTATO REAL", title: isEn ? "Reverse Massage" : "Massagem Reversa", desc: isEn ? "Starts with a Classic massage on your whole body. Then, you take control and massage me." : "Começa com a massagem clássica no seu corpo todo para relaxar a mente. Depois, você assume o controle e faz a massagem em mim.", details: isEn ? "1. Classic full-body massage (approx. 30 min).\n2. The control passes to you.\n3. Freedom to touch and explore.\n4. Mutual ending and real exchange of affection." : "1. Massagem clássica relaxante no corpo todo (aprox. 30 min).\n2. O controle da sessão passa totalmente para você.\n3. Liberdade para me tocar, explorar e guiar o ritmo.\n4. Finalização mútua e troca real de carinho." },
      { id: 'nuru', category: 'final', min: 60, price: p.nuru, icon: "star", popular: true, tag: isEn ? "TOTAL SURRENDER" : "ENTREGA TOTAL", title: isEn ? "Nuru Massage" : "Massagem Nuru", desc: isEn ? "Classic massage first to remove pain. Then, warm gel and my body sliding over yours for extreme relaxation." : "Sempre começamos com a massagem clássica para tirar as dores. Depois, usamos gel aquecido e meu corpo desliza sobre o seu para relaxamento extremo.", details: isEn ? "1. Classic full-body relaxing massage.\n2. Application of warm special gel on both of us.\n3. Full skin-to-skin contact sliding over your body.\n4. Intense ending for complete relaxation." : "1. Massagem clássica relaxante no corpo todo.\n2. Aplicação de gel especial aquecido em nós dois.\n3. Contato total pele com pele, com meu corpo deslizando pelo seu.\n4. Finalização intensa para você relaxar e se entregar completamente." },
      
      { id: 'depilacao', category: 'care', min: 60, price: p.depil, icon: "scissors", tag: isEn ? "AESTHETICS" : "ESTÉTICA", title: isEn ? "Body Hair Trim" : "Aparo de Pelos do Corpo", desc: isEn ? "Leave with a clean, light body ready for the week." : "Eu aparo os pelos do seu corpo com máquina profissional para você ficar impecável e limpo para a semana.", details: isEn ? "1. Trim with clippers\n2. Focus on specific body parts" : "1. Aparo com máquina (pente zero ou três) feito de forma cuidadosa.\n2. Foco nas regiões que você escolher (peito, costas, abdômen ou pernas).\n3. Feito no conforto da sua casa ou hotel.\n4. Resultado: Corpo mais limpo e visual muito mais agradável." }
    ] as ServiceItem[],
    
    plans: [
      { id: 'pack_basic', type: 'pack', title: isEn ? "Routine Relief (2x)" : "Alívio de Rotina (2x)", price: p.pack_basic.v, fullPrice: p.pack_basic.full, savings: p.pack_basic.save, desc: isEn ? "For those who stand or type a lot. Includes a relaxing bonus." : "Para quem trabalha de pé ou digitando. Inclui um bônus relaxante.", details: isEn ? "1x Foot Massage\n1x Classic\nBonus: Free Aromatherapy" : "1x Massagem nos Pés\n1x Massagem Clássica\nBônus: Aromaterapia grátis em ambas as sessões\nDuas semanas garantidas de alívio rápido e aromático.", tag: isEn ? "RELAX" : "RELAX", icon: "watch" },
      { id: 'pack_essencial', type: 'pack', title: isEn ? "Survival Kit (2x)" : "Kit Sobrevivência (2x)", price: p.pack1.v, fullPrice: p.pack1.full, savings: p.pack1.save, desc: isEn ? "Two sessions to cure pain and mind." : "O básico essencial. Duas sessões agendadas no mês: um dia para tirar dores, outro para aliviar a mente.", details: isEn ? "1x Classic\n1x Sensory" : "1x Massagem Clássica (para tirar as dores corporais)\n1x Massagem Sensorial (para esvaziar a cabeça com toques)\nSessões agendadas separadamente no mês.", tag: isEn ? "PERFECT SLEEP" : "DURMA BEM", icon: "layers" },
      { id: 'pack_glow', type: 'pack', title: isEn ? "Full Renewal (2x)" : "Renovação Completa (2x)", price: p.pack_glow.v, fullPrice: p.pack_glow.full, savings: p.pack_glow.save, desc: isEn ? "A day for aesthetics and a day for pleasure. With a time bonus." : "Dia de cuidar da estética e dia de ter muito prazer. Com bônus de tempo.", details: isEn ? "1x Trim\n1x Fusion\nBonus: +30 min free on Fusion" : "1x Aparo de Pelos do Corpo\n1x Experiência Fusion\nBônus: +30 minutos extras grátis na sessão Fusion\nIdeal para elevar a autoestima e aliviar o estresse.", tag: isEn ? "GLOW UP" : "GLOW UP", icon: "sparkles" },
      { id: 'pack_muscle', type: 'pack', title: isEn ? "Recovery Combo (2x)" : "Combo Recuperação (2x)", price: p.pack_muscle.v, fullPrice: p.pack_muscle.full, savings: p.pack_muscle.save, desc: isEn ? "Focused on those who train hard and suffer from intense muscle pain." : "Focado em quem treina pesado e sofre com dores musculares intensas.", details: isEn ? "2x Crossfit\nBonus: Extra Pain Focus free" : "2x Massagem para Atletas (Crossfit)\nBônus: Foco Extra em Dores (Pomadas potentes) grátis\nDuas sessões totalmente dedicadas à sua recuperação física.", tag: isEn ? "MUSCLE" : "MÚSCULOS", icon: "zap" },
      { id: 'pack_interativo', type: 'pack', title: isEn ? "Real Connection (2x)" : "Combo Conexão (2x)", price: p.pack2.v, fullPrice: p.pack2.full, savings: p.pack2.save, desc: isEn ? "Missing human contact? Two encounters to forget loneliness." : "Para quem precisa de contato humano real e intimidade. Dois encontros separados no mês.", details: isEn ? "1x Fusion\n1x Reverse" : "1x Experiência Fusion\n1x Massagem Reversa\nSessões marcadas em dias diferentes para você ter o que esperar no mês\nFoco totalmente voltado a atenção exclusiva.", tag: isEn ? "END OF LONELINESS" : "MAIS CONEXÃO", icon: "heart" },
      { id: 'pack_premium', type: 'pack', title: isEn ? "Boss Plan (3x)" : "Mensalidade do Chefe (3x)", price: p.pack3.v, fullPrice: p.pack3.full, savings: p.pack3.save, desc: isEn ? "You deserve to be treated like a king. Three weeks guaranteed." : "Você trabalha demais, merece um tratamento premium. Três semanas do mês garantidas com excelentes massagens.", details: isEn ? "1x Naturist\n1x Fusion\n1x Nuru" : "1x Naturista (liberdade sem roupas para soltar as amarras)\n1x Fusion (equilíbrio perfeito entre massagem forte e finalização)\n1x Nuru (contato total com gel para o maior relaxamento possível)\nTrês encontros para garantir que seu mês seja um sucesso sem estresse.", tag: isEn ? "MONTH'S REWARD" : "TRATAMENTO PREMIUM", icon: "award" },
      { id: 'pack_ultimate', type: 'pack', title: isEn ? "Pleasure Journey (3x)" : "Jornada do Prazer (3x)", price: p.pack_ultimate.v, fullPrice: p.pack_ultimate.full, savings: p.pack_ultimate.save, desc: isEn ? "Total immersion. Three weeks escalating the level of intimacy." : "A imersão total. Três semanas escalando o nível de relaxamento e intimidade.", details: isEn ? "1x Sensory\n1x Fusion\n1x Nuru\nBonus: Touch allowed free" : "1x Massagem Sensorial\n1x Experiência Fusion\n1x Massagem Nuru\nBônus: Liberdade para Tocar liberada nos 3 encontros\nA forma definitiva de desligar a mente e explorar sensações.", tag: isEn ? "PREMIUM" : "PREMIUM", icon: "heart" }
    ] as ServiceItem[],

    extras: [
      { id: 'hair_trim', price: p.extras.hair_trim, icon: "scissors", label: isEn ? "Trim (Extra)" : "Aparo de Pelos", desc: isEn ? "Maintenance in 2 body parts to look flawless." : "Aparo de pelos com máquina em até 2 áreas do corpo. Fique limpo e com o visual em dia." },
      { id: 'more_time', price: p.extras.more_time, icon: "clock", label: isEn ? "Extended Time (+30m)" : "Mais 30 Minutos", desc: isEn ? "Because when it's good, we don't want it to end." : "Adicione mais 30 minutos na sua sessão. Ideal para curtir sem pressa e relaxar muito mais." },
      { id: 'touch', price: p.extras.touch, icon: "hand", label: isEn ? "Organic Interaction" : "Liberdade para Tocar", desc: isEn ? "Feel free to participate and touch as well." : "Você terá liberdade total para me tocar, acariciar e participar ativamente durante a massagem." },
      { id: 'aroma', price: p.extras.aroma, icon: "sparkles", label: isEn ? "Deep Aromatherapy" : "Aromaterapia", desc: isEn ? "Essential oils that lower your mental frequency." : "Uso de óleos essenciais relaxantes no ambiente e corpo para acalmar a mente." },
      { id: 'pain_relief', price: p.extras.pain_relief, icon: "shield", label: isEn ? "Extra Focus on Pain" : "Alívio de Dores Fortes", desc: isEn ? "Use of technical ointment to treat strong pain." : "Atenção extra nas áreas travadas usando pomadas térmicas potentes para tirar dores." },
      { id: 'dominador', price: p.extras.dominador, icon: "zap", label: isEn ? "Active & Dominant" : "Postura Dominadora", desc: isEn ? "I take full control at the end of the session." : "Eu assumo uma postura mais ativa e dominadora durante a parte final do encontro, com penetração." },
      { id: 'oral', price: p.extras.oral, icon: "heart", label: isEn ? "Oral Included" : "Estímulo Oral", desc: isEn ? "Oral intimacy included in the experience." : "Inclusão de contato direto para maximizar a sua experiência final." },
      { id: 'beijos', price: p.extras.beijos, icon: "heart", label: isEn ? "Kisses Included" : "Beijos e Intimidade", desc: isEn ? "Kisses and affection allowed during the session." : "Beijos na boca e conexão física liberada durante o clima da sessão." },
      { id: 'prostatico', price: p.extras.prostatico, icon: "star", label: isEn ? "Prostatic Massage" : "Massagem Prostática", desc: isEn ? "Manual prostatic stimulation with lube." : "Estimulação interna focada, feita de forma manual e com lubrificante para um relaxamento diferente." }
    ],
    faq: [
      { q: isEn ? "How do the touch and the ending work?" : "Como a finalização funciona na prática?", a: isEn ? "Everything is conducted with extreme respect..." : "Tudo é conduzido com muito respeito ao seu tempo e ao seu corpo. O objetivo é criar um espaço onde você possa confiar, se soltar totalmente e chegar a um relaxamento intenso que vai tirar todo o peso da sua rotina." },
      { q: isEn ? "Where is our meeting location?" : "Onde nós vamos nos encontrar?", a: isEn ? "I come to you..." : "Eu vou até você para o seu maior conforto. Pode ser na sua casa, no seu apartamento ou em um hotel que você reservou. Eu levo o necessário para transformar o ambiente no lugar mais relaxante possível." },
      { q: isEn ? "How should I prepare for the session?" : "O que eu preciso fazer antes da sessão?", a: isEn ? "With an open heart!..." : "A única exigência é que você tome um banho quente e relaxante bem perto do horário da minha chegada. Isso já começa a amolecer os músculos e deixa a pele preparada para o contato." },
      { q: isEn ? "I'm ashamed of my body, what now?" : "Tenho vergonha do meu corpo, o que eu faço?", a: isEn ? "Forget about that..." : "Esqueça completamente isso. Meu ambiente é de acolhimento e sem julgamentos. Não importa sua idade, seu peso ou as marcas do seu corpo. Eu estou indo aí exclusivamente para cuidar de você." },
      { q: isEn ? "Are my points and level saved in the app?" : "Como o aplicativo salva meu progresso (XP)?", a: isEn ? "Yes! To facilitate..." : "Para facilitar, seu progresso é salvo direto no navegador do seu celular. Se você formatar o celular ou limpar o histórico do navegador, os pontos recomeçam do zero." }
    ],
    rules: [
      { icon: "shower", title: isEn ? "The Prep Shower" : "A Ducha Preparatória", description: isEn ? "A prior shower is essential." : "O banho prévio é obrigatório. A água quente relaxa os músculos e a higiene garante que o nosso contato seja perfeito e focado." },
      { icon: "hand", title: isEn ? "Welcoming and Respect" : "Acolhimento e Respeito Mútuo", description: isEn ? "Mutual respect is key." : "Eu me dedico a cuidar de você. Em troca, o respeito deve ser mútuo para que o ambiente seja leve, livre e focado em bem-estar." },
      { icon: "heart", title: isEn ? "Absolute Surrender" : "Entrega Absoluta", description: isEn ? "Forget the outside world." : "O momento que estamos juntos é só seu. Desligue a mente, os problemas ficam lá fora. O foco agora é apenas sentir e aproveitar." },
      { icon: "shield", title: isEn ? "Health and Integrity" : "Saúde e Prevenção", description: isEn ? "I declare that I am healthy." : "Ao agendar, você garante que está com a saúde em dia, sem lesões abertas ou doenças contagiosas, mantendo nosso encontro seguro." }
    ],
    text: {
      welcome: isEn ? "Welcome," : "Bem-vindo,",
      welcome_anon: isEn ? "allow yourself." : "permita-se relaxar.",
      choose_sub: isEn ? "I know how heavy the routine is. Choose how you want to be cared for today." : "Sei que a rotina cansa. Escolha abaixo como você quer relaxar e aproveitar o nosso encontro hoje.",
      level_label: isEn ? "Your Care Journey" : "Sua Jornada de Cuidado",
      tab_packs: isEn ? "Monthly Plans" : "Planos Mensais",
      tab_single: isEn ? "Single Sessions" : "Sessões Avulsas",
      next_btn: isEn ? "Continue" : "Continuar",
      finish_btn: isEn ? "Complete Booking" : "Finalizar Agendamento",
      loading: isEn ? "Preparing your space..." : "Preparando o seu ambiente...",
      toast_select_item: isEn ? "Add at least one service to continue." : "Escolha pelo menos um serviço para continuar.",
      toast_select_date: isEn ? "Choose a date and time for our encounter." : "Selecione uma data e horário válidos para nos vermos.",
      toast_fill_name: isEn ? "Fill in your name to continue." : "Por favor, preencha o seu nome corretamente.",
      toast_fill_addr: isEn ? "Fill in the location so I can visit you." : "Preencha o endereço completo para eu saber onde ir.",
      toast_accept_terms: isEn ? "Please read and accept our agreement." : "Você precisa ler e aceitar as regras para confirmar.",
      toast_coupon_success: isEn ? "Gift applied! Discount activated." : "Benefício ativado com sucesso.",
      toast_coupon_invalid: isEn ? "Invalid or expired code." : "Código inválido ou já expirou.",
      toast_cep_found: isEn ? "Address loaded automatically." : "Localização encontrada pelo CEP.",
      toast_cep_error: isEn ? "CEP not found." : "Não consegui encontrar este CEP.",
      details_label: isEn ? "WHAT YOU WILL EXPERIENCE:" : "VEJA O PASSO A PASSO DO QUE VAI ACONTECER:",
      select_time_title: isEn ? "Choose the perfect moment" : "Escolha a data do nosso encontro",
      location_title: isEn ? "Where will our encounter be?" : "Onde nós vamos nos ver?",
      extras_title: isEn ? "Add something special" : "Adicione complementos opcionais",
      coupon_section: isEn ? "Your Benefits" : "Seus Benefícios Disponíveis",
      coupon_empty: isEn ? "No benefits available at the moment." : "Nenhum benefício disponível no momento.",
      payment_title: isEn ? "Payment method (at the meeting)" : "Forma de pagamento (você paga no local)",
      terms_title: isEn ? "Delivery Agreement" : "Regras e Acordos",
      success_title: isEn ? "Almost there!" : "Tudo Certo! Falta Pouco",
      success_sub: isEn ? "WhatsApp is opening automatically to confirm. If it doesn't open, tap the button below." : "Vou abrir o seu WhatsApp agora para você me enviar o pedido. Se não abrir sozinho, clique no botão abaixo.",
      whatsapp_btn: isEn ? "Open WhatsApp" : "Enviar Pedido no WhatsApp",
      back_home: isEn ? "Start over" : "Voltar para o início",
      timer_text: isEn ? "Cart saved for" : "Sua reserva salva por",
      input_name: isEn ? "Your name or nickname" : "Qual o seu nome ou apelido?",
      input_cep: isEn ? "ZIP Code (CEP)" : "Digite o CEP do local",
      input_addr: isEn ? "Street or Avenue" : "Qual a Rua ou Avenida completa?",
      input_num: isEn ? "Number" : "Número do local",
      input_district: isEn ? "Neighborhood" : "Bairro",
      input_city: isEn ? "City" : "Cidade",
      input_comp: isEn ? "Apt, Block, etc (Optional)" : "Complemento (Apto, Bloco) - Opcional",
      input_hotel: isEn ? "Hotel name" : "Qual o nome do Hotel?",
      input_room: isEn ? "Room / Suite Number" : "Qual o número do Quarto / Suíte?",
      agree_terms: isEn ? "I read and agree to the terms" : "Eu li e aceito todas as regras",
      faq_title: isEn ? "Frequently Asked Questions" : "Tire as Suas Dúvidas",
      reviews_title: isEn ? "Those who allowed themselves:" : "O que os clientes estão dizendo:",
      empty_date: isEn ? "Tap a day above to see available times." : "Toque em um dia ali em cima para ver os horários.",
      empty_slots: isEn ? "Schedule full for this day. Try the next one?" : "Infelizmente minha agenda já está cheia nesse dia. Que tal tentar o próximo?",
      total_label: isEn ? "Total" : "Total",
      subtotal: isEn ? "Subtotal" : "Subtotal",
      discount: isEn ? "Discount" : "Desconto Aplicado",
      pix_discount: isEn ? "Pix (3% OFF)" : "Desconto Pix (3%)",
      welcome_popup_title: isEn ? "Welcome!" : "Que bom ter você aqui!",
      welcome_popup_msg: isEn ? "I'm glad you decided to take time to care for yourself. Here is a gift." : "A maioria das pessoas esquece de cuidar de si mesmas na correria do dia a dia. Para comemorar, pegue esse presente.",
      welcome_popup_warning: isEn ? "Your progress is saved in this browser. Avoid clearing cache data." : "Seus pontos são salvos aqui neste celular. Não limpe o cache do navegador para não perder seu nível.",
      levelup_popup_title: isEn ? "Level Up!" : "Parabéns, você subiu de nível!",
      levelup_popup_msg: isEn ? "Your consistency generated rewards. A new exclusive benefit has been unlocked." : "Você cuidou bem do seu corpo recentemente, e isso te rendeu uma recompensa. Um novo benefício acabou de ser liberado.",
      get_coupon: isEn ? "Claim My Gift" : "Pegar Meu Presente Agora",
      rules_complete: isEn ? "Mutual Agreement" : "Leia para Confirmarmos",
      media_discount: isEn ? "Portfolio Discount (1%)" : "Desconto do Portfólio (1%)",
      media_title: isEn ? "Support my work (Optional)" : "Quer apoiar meu trabalho? (Opcional)",
      media_desc: isEn ? "Allow anonymous aesthetic photos (body outline only, no face/intimacy) for my portfolio and get 1% OFF." : "Deixe eu tirar fotos profissionais e anônimas de detalhes do seu corpo (como mãos ou contorno das costas, NUNCA mostrando rosto ou intimidade) para meu portfólio. Ganhe 1% OFF.",
      media_bonus: isEn ? "Allow for 1% OFF" : "Permitir e ganhar 1% OFF",
      uber_notice: isEn ? "Travel fee (Uber) will be calculated and confirmed via WhatsApp." : "Importante: A taxa de deslocamento até o seu endereço será calculada e avisada no WhatsApp.",
      motel_note: isEn ? "My private suite address will be sent via WhatsApp after booking." : "Perfeito! Assim que você finalizar o agendamento, eu te mando o endereço da minha suíte privada pelo WhatsApp.",
      menu_title: isEn ? "Menu" : "Configurações",
      level_yours: isEn ? "Your Level" : "Seu Progresso de XP",
      level_current: isEn ? "XP" : "Pontos",
      level_journey: isEn ? "Progress" : "Evolução",
      menu_warning: isEn ? "* Progress saved in this browser. Avoid clearing cache." : "* Seus pontos ficam salvos na memória do navegador. Evite apagar o cache para não zerar.",
      theme_title: isEn ? "Appearance" : "Tema do Aplicativo",
      theme_dark: isEn ? "Dark" : "Escuro",
      theme_light: isEn ? "Light" : "Claro",
      refer_btn: isEn ? "Refer Someone" : "Indicar para um amigo",
      share_text: isEn ? 'I found the best massage to relieve all stress.' : 'Encontrei o lugar perfeito para uma massagem que tira todo o estresse.',
      header_tensions: isEn ? "moments of relief" : "pessoas já atendidas",
      step_when: isEn ? "When" : "Quando",
      step_where: isEn ? "Where" : "Onde",
      step_summary: isEn ? "Summary" : "Resumo",
      cart_title: isEn ? "Cart:" : "Sua Seleção:",
      cart_edit: isEn ? "Edit" : "Trocar",
      time_choose: isEn ? "Pick a time" : "Selecione a hora",
      time_rush: isEn ? "Rush" : "Pico",
      loc_home: isEn ? "Residence" : "Residência",
      loc_motel: isEn ? "My Suite" : "Minha Suíte",
      loc_hotel: isEn ? "Hotel" : "Hotel",
      summary_title: isEn ? "Order Summary" : "Resumo do Pedido",
      summary_items: isEn ? "SERVICES" : "O QUE VAMOS FAZER",
      summary_extras: isEn ? "EXTRAS" : "ADICIONAIS EXTRAS",
      summary_info: isEn ? "SESSION DETAILS" : "DADOS DO ENCONTRO",
      summary_loc_home: isEn ? "At your residence" : "Vai ser na sua residência",
      summary_loc_motel: isEn ? "At my private suite" : "Vai ser na minha suíte privada",
      summary_loc_hotel: isEn ? "At a hotel" : "Vai ser no hotel",
      coupon_applied: isEn ? "Coupon Applied" : "Presente Aplicado",
      xp_guaranteed: isEn ? "XP guaranteed" : "XP ganhos hoje",
      media_granted: isEn ? "Authorization Granted" : "Fotos Autorizadas",
      media_support: isEn ? "Support the Work" : "Autorizar Fotos",
      pay_pix: isEn ? "Pix (3% OFF)" : "Pix (Você ganha 3% OFF)",
      pay_card: isEn ? "Card" : "Cartão (Crédito/Débito)",
      pay_cash: isEn ? "Cash" : "Dinheiro em espécie",
      terms_read: isEn ? "Read the rules" : "Toque para ler as regras",
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
      toast_loaded: isEn ? "Progress loaded!" : "Seus pontos foram carregados!",
      toast_cart_toggle: isEn ? "Cart updated." : "Serviço alterado.",
      toast_pix_copied: isEn ? "PIX key copied!" : "Minha chave PIX foi copiada!",
      toast_copy: isEn ? "Copied!" : "Copiado para o teclado!",
      morning: isEn ? "Morning" : "Período da Manhã",
      afternoon: isEn ? "Afternoon" : "Período da Tarde",
      evening: isEn ? "Evening" : "Período da Noite",
    },
    reviews: getFullReviews(lang)
  };
};

// ==================================================================================
// REFINED COMPONENTS (Mobile-First, A11y, Overflow-safe)
// ==================================================================================

// Toast Notification
const ToastContainer = memo(({ toasts, isDark }: { toasts: any[]; isDark: boolean }) => (
  <div aria-live="polite" className="fixed top-5 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-3 pointer-events-none w-[90vw] max-w-sm">
    {toasts.map(t => (
      <div key={t.id} role="alert" className={`animate-toast-in pointer-events-auto flex items-center gap-4 px-5 py-4 rounded-2xl border shadow-2xl ${t.type === 'error' ? 'bg-red-950 border-red-500 text-red-100 shadow-[0_8px_30px_rgba(220,38,38,0.3)]' : isDark ? 'bg-[#181c25] border-zinc-600 text-white shadow-[0_8px_30px_rgba(0,0,0,0.8)]' : 'bg-white border-slate-300 text-slate-900 shadow-[0_8px_30px_rgba(0,0,0,0.15)]'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${t.type === 'error' ? 'bg-red-800 text-red-200' : 'bg-emerald-500/20 text-emerald-400'}`}>
          <Icon name={t.type === 'error' ? 'alert-circle' : 'check'} size={18} />
        </div>
        <span className="text-sm font-semibold leading-snug break-words flex-1">{t.msg}</span>
      </div>
    ))}
  </div>
));

// Refined Button
const Button = memo(({ children, onClick, variant = 'primary', size = 'md', disabled = false, full = false, icon, className = '', loading = false, ariaLabel }: any) => {
  const base = "relative inline-flex items-center justify-center font-semibold tracking-wide transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed select-none active:scale-[0.97] gap-2 shrink-0 overflow-hidden";
  const variants: Record<string, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/25",
    secondary: "bg-white/8 border border-white/12 text-white hover:bg-white/12",
    whatsapp: "bg-[#25D366] text-white hover:bg-[#22c55e] shadow-lg shadow-green-900/25",
    outline: "border border-current text-current hover:bg-white/8",
    ghost: "text-current hover:bg-white/8",
    amber: "bg-amber-500 text-zinc-950 hover:bg-amber-400 shadow-lg shadow-amber-900/25 font-bold",
  };
  const sizes: Record<string, string> = {
    sm: "min-h-[44px] h-auto py-2 px-6 text-sm rounded-xl",
    md: "min-h-[48px] h-auto py-3 px-8 text-base rounded-2xl",
    lg: "min-h-[56px] h-auto py-4 px-10 text-base rounded-2xl",
    xl: "min-h-[64px] h-auto py-4 px-8 sm:px-12 text-lg rounded-2xl",
  };
  return (
    <button type="button" onClick={onClick} disabled={disabled || loading} aria-label={ariaLabel}
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${full ? 'w-full' : ''} ${className}`}>
      {loading
        ? <span className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
        : <>{icon && <Icon name={icon} size={22} className="shrink-0" />}<span className="break-words text-center">{children}</span></>}
    </button>
  );
});

// Refined Input
const InputField = memo(({ label, value, onChange, placeholder, icon, type = 'text', isDark = true, hasError = false, disabled = false, maxLength, id }: any) => {
  const inputId = id || `input-${label?.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div className={`space-y-2 w-full ${hasError ? 'animate-shake' : ''}`}>
      {label && (
        <label htmlFor={inputId} className={`block text-xs font-semibold uppercase tracking-widest pl-1 ${hasError ? 'text-red-400' : isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${hasError ? 'text-red-400' : isDark ? 'text-zinc-500 group-focus-within:text-blue-400' : 'text-slate-400 group-focus-within:text-blue-600'}`}>
            <Icon name={icon} size={22} />
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
          className={`input-field w-full min-h-[56px] rounded-2xl text-base font-medium transition-all border outline-none disabled:opacity-50 disabled:cursor-not-allowed ${icon ? 'pl-12 pr-4' : 'px-5'} ${hasError
            ? 'border-red-500/50 bg-red-950/20 text-red-300 placeholder:text-red-500/40'
            : isDark
              ? 'border-white/12 bg-white/5 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:bg-white/10'
              : 'border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white'
          }`}
        />
      </div>
    </div>
  );
});

// Side Menu
const SideMenu = memo(({ isOpen, onClose, isDark, toggleTheme, user, T }: any) => {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] animate-fade-in" onClick={onClose} aria-hidden="true" />
      <aside role="dialog" aria-modal="true" aria-label={T.menu_title} className={`fixed top-0 right-0 h-full w-full sm:w-80 max-w-sm z-[70] p-6 sm:p-8 shadow-2xl animate-slide-right flex flex-col ${isDark ? 'bg-[#11141a] border-l border-white/10' : 'bg-[#f9f8f6] border-l border-slate-200'}`}>
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-display text-2xl">{T.menu_title}</h2>
          <button onClick={onClose} aria-label="Fechar menu" className={`w-12 h-12 flex items-center justify-center rounded-xl transition-colors ${isDark ? 'hover:bg-white/10 text-zinc-300' : 'hover:bg-slate-200 text-slate-600'}`}>
            <Icon name="x" size={24} />
          </button>
        </div>

        <div className={`mb-6 p-6 rounded-3xl border relative overflow-hidden ${isDark ? 'bg-blue-950/40 border-blue-500/30' : 'bg-blue-50 border-blue-200'}`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <p className={`text-xs uppercase font-semibold tracking-widest mb-2 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>{T.level_yours}</p>
          <div className="flex items-baseline gap-2 flex-wrap break-words">
            <span className="font-display text-5xl shrink-0">{user.xp}</span>
            <span className={`text-xs font-bold uppercase tracking-widest shrink-0 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>XP</span>
          </div>
          <p className={`text-sm mt-4 font-medium leading-relaxed border-t pt-4 break-words ${isDark ? 'border-white/10 text-zinc-400' : 'border-slate-300 text-slate-600'}`}>{T.menu_warning}</p>
        </div>

        <nav className="flex-1 space-y-4 overflow-y-auto">
          <button onClick={toggleTheme} aria-label={`Mudar para tema ${isDark ? T.theme_light : T.theme_dark}`} className={`w-full min-h-[56px] flex items-center justify-between px-5 py-4 rounded-2xl transition-colors ${isDark ? 'hover:bg-white/10 text-zinc-200' : 'hover:bg-slate-200 text-slate-800'}`}>
            <div className="flex items-center gap-4 min-w-0">
              <Icon name={isDark ? "moon" : "sun"} size={22} className={`shrink-0 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
              <span className="text-base font-semibold truncate">{T.theme_title}</span>
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shrink-0 ${isDark ? 'bg-white/10 text-zinc-300' : 'bg-slate-300 text-slate-700'}`}>{isDark ? T.theme_dark : T.theme_light}</span>
          </button>

          <button onClick={() => { if (navigator.share) navigator.share({ title: 'Thalyson Massagens', text: T.share_text, url: window.location.href }); }} className={`w-full min-h-[56px] flex items-center gap-4 px-5 py-4 rounded-2xl transition-colors ${isDark ? 'hover:bg-white/10 text-zinc-200' : 'hover:bg-slate-200 text-slate-800'}`}>
            <Icon name="share" size={22} className="text-emerald-500 shrink-0" />
            <span className="text-base font-semibold truncate">{T.refer_btn}</span>
          </button>
        </nav>
      </aside>
    </>
  );
});

// Review Card
const ReviewCard = memo(({ review, isDark }: { review: Review; isDark: boolean }) => (
  <article className={`h-full flex flex-col p-6 sm:p-8 rounded-[2rem] border transition-all duration-300 ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-200 shadow-sm hover:shadow-md'}`}>
    <div className="flex flex-col sm:flex-row items-start justify-between mb-5 gap-4">
      <div className="flex items-center gap-4 min-w-0 w-full">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold font-display shrink-0 ${isDark ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
          {review.n.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className={`text-base sm:text-lg font-semibold block break-words ${isDark ? 'text-white' : 'text-slate-900'}`}>{review.n}</h3>
          <span className={`text-sm block tracking-wide break-words ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{review.loc}</span>
        </div>
      </div>
      <div className="flex gap-1 shrink-0 mt-1 self-start">
        {[...Array(5)].map((_, i) => (
          <Icon key={i} name="star" size={16} className={i < review.s ? 'text-amber-400 fill-amber-400' : isDark ? 'text-zinc-700' : 'text-slate-200'} />
        ))}
      </div>
    </div>

    <div className={`inline-flex self-start items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider mb-5 border break-words ${isDark ? 'bg-amber-500/15 border-amber-500/30 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
      <Icon name="award" size={14} className="shrink-0" /> {review.serv}
    </div>

    <p className={`text-base leading-relaxed font-medium italic flex-1 break-words-all ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>"{review.t}"</p>
  </article>
));

// FAQ Item
const FAQItem = memo(({ q, a, isDark }: { q: string; a: string; isDark: boolean }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border-b last:border-b-0 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
      <button 
        onClick={() => setOpen(!open)} 
        aria-expanded={open}
        className="w-full py-6 flex items-start sm:items-center justify-between text-left gap-4 group min-h-[64px]"
      >
        <h3 className={`text-base sm:text-lg font-medium leading-snug flex-1 break-words pr-2 ${isDark ? 'text-white/90 group-hover:text-white' : 'text-slate-800 group-hover:text-slate-900'}`}>{q}</h3>
        <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${open ? isDark ? 'bg-blue-600 border-blue-500 text-white rotate-180' : 'bg-blue-600 border-blue-500 text-white rotate-180' : isDark ? 'border-white/20 text-zinc-300' : 'border-slate-300 text-slate-500'}`}>
          <Icon name="chevron-down" size={20} />
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-[800px] pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className={`text-base leading-relaxed break-words ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{a}</p>
      </div>
    </div>
  );
});

// Timer
const SmartTimer = memo(({ isDark, text }: any) => {
  const [time, setTime] = useState(600);
  useEffect(() => {
    const i = setInterval(() => setTime(p => p <= 0 ? 600 : p - 1), 1000);
    return () => clearInterval(i);
  }, []);
  const fmt = (t: number) => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
  const pct = (time / 600) * 100;
  return (
    <div className={`flex items-center gap-5 p-5 rounded-[2rem] border w-full overflow-hidden ${isDark ? 'bg-blue-950/40 border-blue-500/30' : 'bg-blue-50 border-blue-200'}`}>
      <div className={`relative w-16 h-16 shrink-0`}>
        <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
          <circle cx="18" cy="18" r="15" fill="none" stroke={isDark ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.15)'} strokeWidth="2.5" />
          <circle cx="18" cy="18" r="15" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeDasharray={`${pct * 0.942} 100`} className="transition-all duration-1000" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon name="clock" size={20} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-xs font-semibold uppercase tracking-widest mb-1 truncate ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>{text}</p>
        <p className={`font-display text-2xl sm:text-3xl whitespace-nowrap ${isDark ? 'text-white' : 'text-slate-900'}`}>{fmt(time)}</p>
      </div>
    </div>
  );
});

// Rule Item
const RuleItem = memo(({ rule, isDark }: { rule: Rule; isDark: boolean }) => (
  <article className={`flex flex-col sm:flex-row gap-4 sm:gap-5 p-6 rounded-[2rem] border border-transparent transition-colors ${isDark ? 'hover:bg-white/5 hover:border-white/10' : 'hover:bg-slate-50 hover:border-slate-200'}`}>
    <div className={`shrink-0 w-14 h-14 rounded-xl flex items-center justify-center ${isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
      <Icon name={rule.icon} size={28} />
    </div>
    <div className="min-w-0 flex-1">
      <h4 className={`text-lg font-semibold mb-2 font-display break-words ${isDark ? 'text-white' : 'text-slate-900'}`}>{rule.title}</h4>
      <p className={`text-base leading-relaxed break-words ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{rule.description}</p>
    </div>
  </article>
));

// Modal de Serviço
const ServiceModal = memo(({ service, isOpen, onClose, onSelect, isInCart, isDark, T, lang, isPremium }: any) => {
  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md animate-modal-backdrop">
      <div role="dialog" aria-modal="true" aria-labelledby="modal-title" className={`relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-[2.5rem] border shadow-2xl animate-scale-in overflow-hidden ${isDark ? 'bg-[#11141a] border-white/10' : 'bg-[#ffffff] border-slate-200'}`}>
        
        <div className={`relative p-6 sm:p-8 pb-6 flex-shrink-0 ${isPremium ? (isDark ? 'bg-amber-950/30' : 'bg-amber-50/80') : (isDark ? 'bg-blue-950/30' : 'bg-blue-50/80')}`}>
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          
          <button onClick={onClose} aria-label="Fechar detalhes do serviço" className={`absolute top-4 right-4 sm:top-6 sm:right-6 w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-black/30 text-white hover:bg-black/50' : 'bg-black/5 text-slate-700 hover:bg-black/10'}`}>
            <Icon name="x" size={24} />
          </button>

          <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center border shadow-lg mb-6 ${isPremium ? isDark ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' : 'bg-amber-100 border-amber-300 text-amber-700' : isDark ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
            <Icon name={service.icon} size={32} />
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
            <div className={`inline-block text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border break-words ${isPremium ? isDark ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' : 'bg-amber-100 border-amber-300 text-amber-800' : isDark ? 'bg-white/10 border-white/20 text-zinc-200' : 'bg-slate-100 border-slate-300 text-slate-700'}`}>
              {service.tag}
            </div>
            {service.popular && (
              <div className={`inline-block text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full shadow-sm break-words ${isPremium ? 'bg-amber-500 text-zinc-950' : 'bg-blue-600 text-white'}`}>
                {T.popular_badge}
              </div>
            )}
          </div>

          <h2 id="modal-title" className={`font-display text-2xl sm:text-3xl leading-tight mb-2 break-words pr-8 sm:pr-0 ${isDark ? 'text-white' : 'text-slate-900'}`}>{service.title}</h2>
          
          <div className="flex items-baseline flex-wrap gap-2 sm:gap-3 mt-4">
            {service.fullPrice && (
              <span className={`text-sm sm:text-base font-medium line-through whitespace-nowrap ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                {T.from} {formatMoney(service.fullPrice, lang)}
              </span>
            )}
            <span className={`font-display text-2xl sm:text-3xl whitespace-nowrap ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatMoney(service.price, lang)}</span>
          </div>
        </div>

        <div className={`flex-1 overflow-y-auto p-6 sm:p-8 pt-6 space-y-8 scrollbar-hide ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
          <p className="text-base leading-relaxed font-medium break-words">{service.desc}</p>
          
          <div>
            <h4 className={`text-sm font-bold uppercase tracking-widest mb-5 break-words ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.details_label}</h4>
            <div className="space-y-5">
              {service.details.split('\n').map((line: string, i: number) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`mt-1 shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${isPremium ? isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700' : isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                    <Icon name="check" size={14} />
                  </div>
                  <span className={`text-base leading-relaxed break-words min-w-0 flex-1 ${isDark ? 'text-zinc-200' : 'text-slate-700'}`}>{line}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`p-5 sm:p-8 border-t shrink-0 ${isDark ? 'border-white/10 bg-[#11141a]' : 'border-slate-200 bg-white'}`}>
          <Button 
            full size="xl" 
            variant={isInCart ? 'outline' : isPremium ? 'amber' : 'primary'}
            onClick={() => { onSelect(service); onClose(); }}
          >
            {isInCart ? (lang === 'en' ? 'Remove Selection' : 'Remover Seleção') : (lang === 'en' ? 'Select Service' : 'Selecionar Serviço')}
          </Button>
        </div>
      </div>
    </div>
  );
});

// Service Card
const ServiceCard = memo(({ service, isInCart, onToggle, isDark, T, lang, isPremium = false, onOpenModal }: any) => {
  return (
    <button
      className={`relative w-full text-left rounded-[2rem] border transition-all duration-300 overflow-hidden card-hover flex flex-col h-auto min-h-[200px] sm:min-h-[220px] ${isInCart
        ? isPremium
          ? 'service-card-selected-amber border-amber-500/70 bg-amber-500/10'
          : 'service-card-selected border-blue-500/70 bg-blue-500/10'
        : isDark
          ? 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
          : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'
      }`}
      onClick={() => onOpenModal(service)}
      aria-label={`Ver detalhes de ${service.title}`}
    >
      {isInCart && (
        <div className={`absolute top-5 right-5 z-10 w-8 h-8 rounded-full flex items-center justify-center animate-check-pop shrink-0 ${isPremium ? 'bg-amber-500 text-zinc-950' : 'bg-blue-600 text-white'}`}>
          <Icon name="check" size={18} />
        </div>
      )}

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start gap-4 sm:gap-5 mb-5">
          <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center border shrink-0 ${isPremium ? isDark ? 'bg-amber-500/15 border-amber-500/30 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-600' : isDark ? 'bg-white/10 border-white/20 text-zinc-200' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
            <Icon name={service.icon} size={28} />
          </div>
          <div className="flex-1 min-w-0 pr-6 sm:pr-4">
            <h3 className={`text-lg sm:text-xl font-display leading-tight mb-2 break-words ${isDark ? 'text-white' : 'text-slate-900'}`}>{service.title}</h3>
            <p className={`text-sm sm:text-base leading-relaxed line-clamp-3 sm:line-clamp-2 break-words ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{service.desc}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mt-auto pt-4 sm:pt-6 gap-4 sm:gap-2">
          <div className="flex items-center gap-2 shrink-0">
            <div className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border break-words ${isPremium ? isDark ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' : 'bg-amber-50 border-amber-300 text-amber-800' : isDark ? 'bg-white/10 border-white/20 text-zinc-300' : 'bg-slate-100 border-slate-300 text-slate-600'}`}>
              {service.tag}
            </div>
          </div>
          
          <div className="text-left sm:text-right shrink-0 w-full sm:w-auto flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start">
            {service.fullPrice && (
              <p className={`text-xs font-medium line-through mb-0 sm:mb-1 whitespace-nowrap ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                {formatMoney(service.fullPrice, lang)}
              </p>
            )}
            <p className={`font-display text-2xl leading-none whitespace-nowrap ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatMoney(service.price, lang)}</p>
          </div>
        </div>
      </div>
    </button>
  );
});

// Category Section Configuration
const CATEGORY_CONFIG: Record<string, { color: string; glow: string; borderColor: string; bg: string; lightBg: string; lightBorder: string }> = {
  relax: { color: '#3b82f6', glow: 'rgba(59,130,246,0.15)', borderColor: 'rgba(59,130,246,0.25)', bg: 'rgba(59,130,246,0.05)', lightBg: 'rgba(59,130,246,0.04)', lightBorder: 'rgba(59,130,246,0.15)' },
  express: { color: '#10b981', glow: 'rgba(16,185,129,0.15)', borderColor: 'rgba(16,185,129,0.25)', bg: 'rgba(16,185,129,0.05)', lightBg: 'rgba(16,185,129,0.04)', lightBorder: 'rgba(16,185,129,0.15)' },
  final: { color: '#f59e0b', glow: 'rgba(245,158,11,0.15)', borderColor: 'rgba(245,158,11,0.25)', bg: 'rgba(245,158,11,0.05)', lightBg: 'rgba(245,158,11,0.04)', lightBorder: 'rgba(245,158,11,0.15)' },
  care: { color: '#ec4899', glow: 'rgba(236,72,153,0.15)', borderColor: 'rgba(236,72,153,0.25)', bg: 'rgba(236,72,153,0.05)', lightBg: 'rgba(236,72,153,0.04)', lightBorder: 'rgba(236,72,153,0.15)' },
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
  const [welcomePopup, setWelcomePopup] = useState(false);
  const [levelUpPopup, setLevelUpPopup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const [isFetchingCep, setIsFetchingCep] = useState(false);
  const [hasErrorGlobal, setHasErrorGlobal] = useState(false);
  
  const [selectedServiceForModal, setSelectedServiceForModal] = useState<ServiceItem | null>(null);

  const DATA = useMemo(() => getData(lang), [lang]);
  const T = DATA.text;

  const [user, setUser] = useState<UserData>({
    name: '', xp: 0, coupons: [], usedCoupons: [], hasSeenWelcome: false, ordersCount: 92, lastActivity: new Date().toISOString()
  });

  const [booking, setBooking] = useState<BookingData>({
    type: 'single', cart: [], extras: {}, date: null, time: null, locationType: 'home',
    address: { cep: '', street: '', number: '', district: '', city: '', comp: '', placeName: '' },
    payment: '', appliedCoupon: null, termsAccepted: false, bookingId: `BOOK_${Date.now()}`, mediaAllowed: false
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
    if (isClient) document.title = step === 0 ? "Thalyson Massagens" : (lang === 'en' ? "Your Booking - Thalyson" : "Seu Agendamento - Thalyson");
  }, [step, isClient, lang]);

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
              mediaAllowed: !!parsed.bookingDraft.mediaAllowed,
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
    setTimeout(() => setLoading(false), 900);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient]);

  useEffect(() => {
    if (isClient && dataLoaded) {
      try {
        const save = {
          user: { ...user, lastActivity: new Date().toISOString() },
          bookingDraft: { ...booking, appliedCoupon: booking.appliedCoupon ? { ...booking.appliedCoupon } : null },
          step
        };
        const s = JSON.stringify(save);
        if (s.length < CONFIG.MAX_STORAGE_SIZE * 1024) localStorage.setItem(CONFIG.STORAGE_KEY, s);
      } catch {}
    }
  }, [user, booking, step, isClient, dataLoaded]);

  useEffect(() => {
    if (!loading && isClient && dataLoaded) {
      if (!user.hasSeenWelcome) {
        const t = setTimeout(() => setWelcomePopup(true), 2200);
        return () => clearTimeout(t);
      } else {
        addToast(T.toast_loaded, 'success');
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
    setCartBounce(true);
    setTimeout(() => setCartBounce(false), 500);
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
            ...b,
            address: {
              ...b.address,
              cep: masked,
              street: data.logradouro || b.address.street,
              district: data.bairro || b.address.district,
              city: data.localidade || b.address.city,
            }
          }));
          addToast(T.toast_cep_found, 'success');
          vibrate([50, 50]);
        } else {
          addToast(T.toast_cep_error, 'error');
        }
      } catch (err) {
        // Silent fail
      } finally {
        setIsFetchingCep(false);
      }
    }
  };

  const getDayLabel = useCallback((d: Date) => {
    const today = new Date(); 
    const tmrw = new Date(today); 
    tmrw.setDate(today.getDate() + 1); 
    
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
    const now = new Date();
    const sel = new Date(booking.date);
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
    if (booking.cart.length === 0) return { total: 0, sub: 0, disc: 0, pixDisc: 0, mediaDisc: 0, rushFee: 0, duration: 0 };
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
    const duration = baseDuration + addedTime;
    const isRush = RUSH_HOURS.includes(booking.time || '');
    const rushFee = (isRush && booking.locationType !== 'motel') ? RUSH_FEE : 0;
    const disc = booking.appliedCoupon ? booking.appliedCoupon.val : 0;
    let running = Math.max(0, sub - disc);
    let mediaDisc = 0;
    if (booking.mediaAllowed) { mediaDisc = Math.ceil(running * 0.01); running = Math.max(0, running - mediaDisc); }
    let pixDisc = 0;
    if (booking.payment === 'pix') pixDisc = Math.ceil(running * 0.03);
    return { sub, disc, pixDisc, mediaDisc, rushFee, total: Math.max(0, running - pixDisc) + rushFee, duration };
  }, [booking.cart, booking.extras, booking.appliedCoupon, DATA.extras, booking.payment, booking.mediaAllowed, booking.time, booking.locationType]);

  const estimatedXP = useMemo(() => {
    const isPack = booking.cart.some(i => i.type === 'pack');
    return Math.floor(financials.total * (isPack ? 0.30 : 0.15));
  }, [financials.total, booking.cart]);

  const nextLevel = useMemo(() => {
    if (user.xp >= 800) {
      const need = 500 - ((user.xp - 800) % 500); 
      return { needed: need, reward: DATA.levels[3].reward }; 
    }
    const next = DATA.levels.find(l => l.xpNeeded > user.xp);
    return next ? { needed: next.xpNeeded - user.xp, reward: next.reward } : null;
  }, [user.xp, DATA.levels]);

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
      vibrate([50, 50]);
      setHasErrorGlobal(true);
      setTimeout(() => setHasErrorGlobal(false), 500);

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
      const lines = item.details.split('\n').map(l => `  • ${l}`).join('\n');
      return `*${item.title}*\n_${item.desc}_\n*${isEn ? 'Details' : 'Detalhes'}:*\n${lines}`;
    }).join('\n\n');
    let locTxt = '', mapQ = '';
    
    if (booking.locationType === 'home') { 
      const a = `${booking.address.street}, ${booking.address.number} - ${booking.address.district}, ${booking.address.city}`; 
      locTxt = `*${isEn ? 'Residence' : 'Residência'}*\nEndereço: ${a}\nDetalhes: ${booking.address.comp || '-'}`; 
      mapQ = a; 
    } else if (booking.locationType === 'motel') {
      locTxt = `*${isEn ? 'My Suite' : 'Minha Suíte'}*\n(${isEn ? 'Address confirmed on WhatsApp' : 'Endereço confirmado no WhatsApp'})`;
    } else { 
      const a = `${booking.address.placeName}, ${booking.address.city}`; 
      locTxt = `*Hotel: ${booking.address.placeName}*\nCidade: ${booking.address.city}\n${isEn ? 'Room' : 'Quarto'}: ${booking.address.comp || '-'}`; 
      mapQ = a; 
    }
    
    const extrasList = Object.keys(booking.extras || {}).filter(k => booking.extras[k]).map(k => { 
      const ex = DATA.extras.find((e: any) => e.id === k); 
      return ex ? `• ${ex.label}` : ''; 
    }).filter(Boolean).join('\n');
    
    let prices = `*${isEn ? 'Subtotal' : 'Subtotal'}:* ${formatMoney(f.sub, lang)}`;
    if (f.disc > 0) prices += `\n*${booking.appliedCoupon?.code}:* -${formatMoney(f.disc, lang)}`;
    if (f.mediaDisc > 0) prices += `\n*${isEn ? 'Portfolio' : 'Portfólio'}:* -${formatMoney(f.mediaDisc, lang)}`;
    if (f.pixDisc > 0) prices += `\n*PIX (3%):* -${formatMoney(f.pixDisc, lang)}`;
    if (f.rushFee > 0) prices += `\n*${isEn ? 'Rush Fee' : 'Taxa Pico'}:* +${formatMoney(f.rushFee, lang)}`;
    prices += `\n\n*${isEn ? 'TOTAL' : 'TOTAL'}: ${formatMoney(f.total, lang)}*`;
    
    const mapLink = mapQ ? `\nGPS: https://www.google.com/maps/search/?api=1&query=$${encodeURIComponent(mapQ)}` : '';
    
    return (isEn 
      ? `*CARE RESERVATION* | #${hash}\n──────────────────\nHello Thalyson! I'd like to schedule my moment.\n\n*Name:* ${sanitizeInput(user.name)}\n*Date:* ${dateStr} at ${booking.time}\n*Duration:* ${f.duration} min\n\n*SERVICES CHOSEN:*\n${servicesText}\n\n${extrasList ? `*Extras:*\n${extrasList}\n\n` : ''}*LOCATION:*\n${locTxt}${mapLink}\n\n${booking.locationType !== 'motel' ? `Travel fee (Uber) to be confirmed in chat.\n` : ''}*Health:* I declare I am 100% healthy.\n\n*INVESTMENT:*\n${prices}\n\n*Payment:* ${booking.payment.toUpperCase()}\n──────────────────\n_I accept the terms and await confirmation._` 
      : `*PEDIDO DE ENCONTRO* | #${hash}\n──────────────────\nOlá Thalyson! Gostaria de agendar meu momento.\n\n*Nome:* ${sanitizeInput(user.name)}\n*Data:* ${dateStr} às ${booking.time}\n*Tempo Estimado:* ${f.duration} min\n\n*SERVIÇOS ESCOLHIDOS:*\n${servicesText}\n\n${extrasList ? `*Extras Selecionados:*\n${extrasList}\n\n` : ''}*ONDE VAMOS NOS VER:*\n${locTxt}${mapLink}\n\n${booking.locationType !== 'motel' ? `Aviso: Taxa de deslocamento será confirmada no chat.\n` : ''}*Saúde:* Declaro estar 100% saudável.\n\n*VALOR FINAL:*\n${prices}\n\n*Pagamento escolhido:* ${booking.payment.toUpperCase()}\n──────────────────\n_Eu li e aceito as regras. Aguardo sua confirmação._`
    ).trim();
  };

  const finishBooking = () => {
    vibrate([100, 50, 100, 50, 100]); // Success pattern
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
    dateScrollRef.current?.scrollBy({ left: dir === 'left' ? -260 : 260, behavior: 'smooth' });
  };

  const categoryConfig = [
    { id: 'relax', title: lang === 'en' ? "Just Relax" : "Apenas Relaxar", icon: 'sun', desc: lang === 'en' ? "Therapeutic body work to relieve stress." : "Tire a dor muscular e todo o estresse das costas." },
    { id: 'express', title: lang === 'en' ? "Express Care" : "Cuidados Rápidos", icon: 'watch', desc: lang === 'en' ? "Quick localized relief for hands and feet." : "Alívio rápido e localizado nas mãos e pés cansados." },
    { id: 'final', title: lang === 'en' ? "With Ending" : "Massagens com Finalização", icon: 'sparkles', desc: lang === 'en' ? "A complete and intense sensory journey." : "A verdadeira jornada completa que termina com relaxamento final." },
    { id: 'care', title: lang === 'en' ? "Personal Care" : "Cuidados Pessoais", icon: 'scissors', desc: lang === 'en' ? "Aesthetic body maintenance." : "Manutenção estética para deixar seu corpo impecável." },
  ];

  if (!isClient) return <div className="min-h-screen w-full bg-[#11141a]" />;

  if (loading) {
    return (
      <div className={`fixed inset-0 flex flex-col items-center justify-center z-[100] ${isDark ? 'bg-[#11141a]' : 'bg-[#f9f8f6]'}`}>
        <div className="flex flex-col items-center max-w-[280px] w-full px-8 text-center">
          <div className="relative mb-10">
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl scale-[1.8] animate-pulse" />
            <div className="relative w-24 h-24 rounded-[2rem] bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-2xl border border-blue-400/20">
              <span className="font-display text-5xl text-white">T</span>
            </div>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-6">
            <div className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 w-1/2 loading-bar-anim" />
          </div>
          <p className={`text-sm uppercase font-semibold tracking-widest break-words ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <GlobalStyles isDark={isDark} />

      {isDark && (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-blue-600/5 rounded-full blur-[100px] sm:blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-600/4 rounded-full blur-[80px] sm:blur-[100px]" />
        </div>
      )}

      <ToastContainer toasts={toasts} isDark={isDark} />
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} isDark={isDark} toggleTheme={() => setIsDark(p => !p)} user={user} T={T} />
      
      <ServiceModal 
        service={selectedServiceForModal}
        isOpen={!!selectedServiceForModal}
        onClose={() => setSelectedServiceForModal(null)}
        onSelect={handleToggleCartItem}
        isInCart={selectedServiceForModal ? booking.cart.some(c => c.id === selectedServiceForModal.id) : false}
        isDark={isDark}
        T={T}
        lang={lang}
        isPremium={selectedServiceForModal?.type === 'pack'}
      />

      <main className={`min-h-screen relative z-10 pb-56 px-4 sm:px-8 max-w-5xl mx-auto overflow-x-hidden`}>

        {step !== 4 && (
          <header className="pt-8 pb-8 sm:pt-14 sm:pb-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <button onClick={() => setStep(0)} className="group text-left" aria-label="Voltar para o início">
                <h1 className={`font-display text-4xl sm:text-5xl leading-tight mb-3 break-words transition-opacity group-hover:opacity-80 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Thalyson Massagens
                </h1>
                <div className={`flex items-center gap-3 text-sm uppercase tracking-widest font-semibold flex-wrap break-words ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  <span className="relative flex h-3 w-3 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500" />
                  </span>
                  {lang === 'en' ? `${user.ordersCount}+ ${T.header_tensions}` : `+${user.ordersCount} ${T.header_tensions}`}
                </div>
              </button>

              <div className="flex items-center gap-3 sm:gap-4 shrink-0 w-full sm:w-auto justify-start sm:justify-end">
                <button onClick={() => setLang(l => l === 'pt' ? 'en' : 'pt')} aria-label={`Mudar idioma para ${lang === 'pt' ? 'Inglês' : 'Português'}`} className={`relative h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center rounded-xl sm:rounded-2xl border transition-all ${isDark ? 'border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white' : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900'}`}>
                  <Icon name="globe" size={24} />
                  <span className="absolute -bottom-2 -right-2 text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-md leading-none">{lang.toUpperCase()}</span>
                </button>
                <button onClick={() => openExternal('instagram')} aria-label="Abrir Instagram" className={`h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center rounded-xl sm:rounded-2xl border transition-all ${isDark ? 'border-white/10 bg-white/5 text-pink-400 hover:bg-white/10' : 'border-slate-200 bg-slate-50 text-pink-600 hover:text-pink-700'}`}>
                  <Icon name="instagram" size={24} />
                </button>
                <button onClick={() => setMenuOpen(true)} aria-label="Abrir Menu Principal" className={`h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center rounded-xl sm:rounded-2xl border transition-all ${isDark ? 'border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white' : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900'}`}>
                  <Icon name="menu" size={24} />
                </button>
              </div>
            </div>

            {step > 0 && step < 4 && (
              <nav aria-label="Progresso do agendamento" className="mt-10 sm:mt-12 flex items-center gap-2 sm:gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => { if (i < step) setStep(i); }}>
                    <div className={`w-full h-2 rounded-full transition-all duration-500 ${step > i ? 'bg-blue-600' : step === i ? 'bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)]' : isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
                    <span className={`text-[10px] sm:text-xs uppercase font-bold tracking-widest break-words text-center ${step >= i ? isDark ? 'text-white' : 'text-slate-800' : isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
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
            <section className="animate-fade-up space-y-12 sm:space-y-16">

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 items-center">
                <div>
                  <h2 className={`font-display text-4xl sm:text-5xl leading-[1.2] mb-6 break-words ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {T.welcome} <span className="italic text-gradient-blue break-words">{user.name ? String(user.name).trim().split(' ')[0] : T.welcome_anon}</span>
                  </h2>
                  <p className={`text-lg sm:text-xl leading-relaxed max-w-md break-words ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{T.choose_sub}</p>
                </div>

                <article className={`p-6 sm:p-10 rounded-[2.5rem] border relative overflow-hidden ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-8 sm:mb-10 gap-6 relative">
                    <div className="flex items-center gap-5 min-w-0">
                      <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 ${isDark ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'bg-amber-50 text-amber-700 border border-amber-300'}`}>
                        <Icon name="award" size={32} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className={`text-xs sm:text-sm uppercase font-bold tracking-widest break-words ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.level_label}</h3>
                        <p className={`text-lg sm:text-xl font-semibold mt-1 truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{getCurrentLevelTitle()}</p>
                      </div>
                    </div>
                    <div className="sm:text-right shrink-0">
                      <span className="font-display text-5xl sm:text-6xl text-gradient-blue whitespace-nowrap">{user.xp}</span>
                      <span className={`text-xs uppercase font-bold tracking-widest block mt-1 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.level_current}</span>
                    </div>
                  </div>

                  <div className="relative">
                    <div className={`flex justify-between text-xs uppercase font-bold tracking-widest mb-4 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                      <span>{T.level_journey}</span>
                      <span>{Math.floor(getCurrentLevelProgress())}%</span>
                    </div>
                    <div className={`h-3 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
                      <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-1000" style={{ width: `${getCurrentLevelProgress()}%` }} />
                    </div>
                    {nextLevel && (
                      <p className={`text-sm mt-6 text-center font-medium break-words ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                        {T.msg_level_keep1} <strong className={isDark ? 'text-white' : 'text-slate-900'}>{nextLevel.needed} XP</strong> {T.msg_level_keep2} <span className="text-blue-500 whitespace-nowrap font-semibold">{formatMoney(nextLevel.reward, lang)}</span>
                      </p>
                    )}
                  </div>
                </article>
              </div>

              <nav aria-label="Tipos de agendamento" className={`flex flex-wrap sm:flex-nowrap p-2 sm:p-3 rounded-3xl border w-full sm:w-fit mx-auto shadow-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                {[
                  { id: 'single', label: T.tab_single, icon: 'user' },
                  { id: 'packs', label: T.tab_packs, icon: 'package' }
                ].map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} aria-pressed={activeTab === tab.id}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-8 py-4 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 min-h-[56px] ${activeTab === tab.id
                      ? tab.id === 'packs' ? 'bg-amber-500 text-zinc-950 shadow-lg' : 'bg-blue-600 text-white shadow-lg'
                      : isDark ? 'text-zinc-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-800 hover:bg-white'}`}>
                    <Icon name={tab.icon} size={20} className="shrink-0" />
                    <span className="break-words text-center">{tab.label}</span>
                  </button>
                ))}
              </nav>

              <div className="tab-content">
                {activeTab === 'single' ? (
                  <div className="space-y-12 sm:space-y-16">
                    {categoryConfig.map(cat => {
                      const services = DATA.services.filter((s: ServiceItem) => s.category === cat.id);
                      if (!services.length) return null;
                      const cfg = CATEGORY_CONFIG[cat.id];
                      return (
                        <section key={cat.id} aria-label={cat.title} className="rounded-[2.5rem] overflow-hidden border" style={{ borderColor: cfg.borderColor, background: isDark ? cfg.bg : cfg.lightBg }}>
                          <div className="px-6 sm:px-10 py-6 sm:py-8 flex items-center gap-5 sm:gap-6 border-b" style={{ borderColor: cfg.borderColor }}>
                            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shrink-0 shadow-sm" style={{ background: `${cfg.color}15`, border: `1px solid ${cfg.color}30` }}>
                              <Icon name={cat.icon} size={32} style={{ color: cfg.color }} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h2 className={`font-display text-2xl sm:text-4xl leading-tight mb-1 sm:mb-2 break-words ${isDark ? 'text-white' : 'text-slate-900'}`}>{cat.title}</h2>
                              <p className={`text-sm sm:text-lg break-words ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{cat.desc}</p>
                            </div>
                            {booking.cart.filter(c => c.category === cat.id).length > 0 && (
                              <div className="ml-auto shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base font-bold text-white shadow-md" style={{ background: cfg.color }}>
                                {booking.cart.filter(c => c.category === cat.id).length}
                              </div>
                            )}
                          </div>

                          <div className="p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8">
                            {services.map((s: ServiceItem) => (
                              <ServiceCard key={s.id} service={s} isInCart={booking.cart.some(c => c.id === s.id)} onToggle={handleToggleCartItem} isDark={isDark} T={T} lang={lang} onOpenModal={setSelectedServiceForModal} />
                            ))}
                          </div>
                        </section>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    {DATA.plans.map((s: ServiceItem) => (
                      <ServiceCard key={s.id} service={s} isInCart={booking.cart.some(c => c.id === s.id)} onToggle={handleToggleCartItem} isDark={isDark} T={T} lang={lang} isPremium={true} onOpenModal={setSelectedServiceForModal} />
                    ))}
                  </div>
                )}
              </div>

              <section aria-labelledby="reviews-title" className="py-12 sm:py-16 border-t border-b" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                <div className="flex items-center justify-between mb-8 sm:mb-10 gap-4">
                  <h2 id="reviews-title" className={`font-display text-3xl sm:text-4xl break-words ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.reviews_title}</h2>
                  <div className="hidden sm:flex gap-4 shrink-0">
                    {['chevron-left', 'chevron-right'].map((dir, i) => (
                      <button key={dir} aria-label={i === 0 ? "Ver avaliações anteriores" : "Ver próximas avaliações"} onClick={() => reviewScrollRef.current?.scrollBy({ left: i === 0 ? -320 : 320, behavior: 'smooth' })}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all hover:-translate-y-1 ${isDark ? 'border-white/10 bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10' : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900 shadow-sm'}`}>
                        <Icon name={dir} size={24} />
                      </button>
                    ))}
                  </div>
                </div>
                <div ref={reviewScrollRef} className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-5 sm:gap-6 pb-6 -mx-4 px-4 sm:-mx-8 sm:px-8" style={{ scrollbarWidth: 'none' }}>
                  {DATA.reviews.map((r: Review, i: number) => (
                    <div key={i} className="snap-center shrink-0 w-[85vw] sm:w-[360px] md:w-[400px] h-auto">
                      <ReviewCard review={r} isDark={isDark} />
                    </div>
                  ))}
                </div>
              </section>

              <section aria-labelledby="faq-title" className="max-w-4xl mx-auto pb-10">
                <h2 id="faq-title" className={`font-display text-3xl sm:text-4xl text-center mb-8 sm:mb-12 break-words ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.faq_title}</h2>
                <div className={`rounded-[2.5rem] border overflow-hidden ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <div className="px-6 sm:px-10 divide-y" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
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
            <section className="animate-fade-up max-w-2xl mx-auto space-y-8 sm:space-y-12">
              <header className="text-center">
                <h2 className={`font-display text-4xl sm:text-5xl mb-4 break-words ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.location_title}</h2>
              </header>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                {[
                  { id: 'home', label: T.loc_home, icon: 'home', desc: lang === 'en' ? 'I come to you' : 'Vou até você' },
                  { id: 'motel', label: T.loc_motel, icon: 'bed', desc: lang === 'en' ? 'Discreet space' : 'Local discreto' },
                  { id: 'hotel', label: T.loc_hotel, icon: 'building', desc: lang === 'en' ? 'Your room' : 'Seu quarto' }
                ].map(x => (
                  <button key={x.id} onClick={() => setBooking(b => ({ ...b, locationType: x.id as any }))} aria-pressed={booking.locationType === x.id}
                    className={`p-6 sm:py-8 sm:px-4 rounded-[2rem] flex flex-row sm:flex-col items-center sm:justify-center gap-5 transition-all duration-300 border min-h-[100px] w-full text-left sm:text-center ${booking.locationType === x.id
                      ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/40 sm:scale-105'
                      : isDark ? 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white hover:border-white/20' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 shadow-sm hover:shadow-md'}`}>
                    <Icon name={x.icon} size={32} className="shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="block text-base font-bold uppercase tracking-widest break-words">{x.label}</span>
                      <span className={`block text-sm mt-1 font-medium break-words ${booking.locationType === x.id ? 'text-blue-200' : isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{x.desc}</span>
                    </div>
                  </button>
                ))}
              </div>

              <article className={`p-6 sm:p-12 rounded-[2.5rem] border space-y-6 sm:space-y-8 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                <InputField isDark={isDark} label={T.input_name} value={user.name}
                  onChange={(e: any) => setUser(u => ({ ...u, name: sanitizeInput(e.target.value) }))}
                  icon="user" placeholder={lang === 'en' ? "Your name" : "Como quer ser chamado?"}
                  hasError={hasErrorGlobal && (!user.name || String(user.name).trim().length < 3)} />

                {booking.locationType === 'home' && (
                  <div className="space-y-6 sm:space-y-8 animate-fade-up">
                    <InputField isDark={isDark} label={T.input_cep} value={booking.address.cep || ''}
                      onChange={handleCepChange}
                      icon="map-pin" placeholder="00000-000" type="tel" maxLength={9}
                      disabled={isFetchingCep}
                      hasError={hasErrorGlobal && !booking.address.street} />

                    <InputField isDark={isDark} label={T.input_addr} value={booking.address.street}
                      onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, street: sanitizeInput(e.target.value) } }))}
                      placeholder={lang === 'en' ? "Street / Avenue" : "Rua / Avenida completa"}
                      disabled={isFetchingCep}
                      hasError={hasErrorGlobal && !booking.address.street} />
                      
                    <InputField isDark={isDark} label={T.input_num} value={booking.address.number}
                      onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, number: sanitizeInput(e.target.value) } }))}
                      placeholder="Número" type="tel"
                      hasError={hasErrorGlobal && !booking.address.number} />
                      
                    <InputField isDark={isDark} label={T.input_district} value={booking.address.district}
                      onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, district: sanitizeInput(e.target.value) } }))}
                      placeholder={lang === 'en' ? "Neighborhood" : "Nome do Bairro"}
                      disabled={isFetchingCep}
                      hasError={hasErrorGlobal && !booking.address.district} />
                      
                    <InputField isDark={isDark} label={T.input_city} value={booking.address.city}
                      onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, city: sanitizeInput(e.target.value) } }))}
                      placeholder={lang === 'en' ? "City" : "Nome da Cidade"}
                      disabled={isFetchingCep}
                      hasError={hasErrorGlobal && !booking.address.city} />
                      
                    <InputField isDark={isDark} label={T.input_comp} value={booking.address.comp}
                      onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, comp: sanitizeInput(e.target.value) } }))}
                      placeholder={lang === 'en' ? "Apt (Optional)" : "Apto, Bloco (Opcional)"} />
                  </div>
                )}

                {booking.locationType === 'hotel' && (
                  <div className="space-y-6 sm:space-y-8 animate-fade-up">
                    <InputField isDark={isDark} label={T.input_hotel} value={booking.address.placeName}
                      onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, placeName: sanitizeInput(e.target.value) } }))}
                      icon="building" placeholder={lang === 'en' ? "Hotel name" : "Nome completo do Hotel"} hasError={hasErrorGlobal && !booking.address.placeName} />
                      
                    <InputField isDark={isDark} label={T.input_city} value={booking.address.city}
                      onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, city: sanitizeInput(e.target.value) } }))}
                      placeholder={lang === 'en' ? "City" : "Cidade do Hotel"} hasError={hasErrorGlobal && !booking.address.city} />
                      
                    <InputField isDark={isDark} label={T.input_room} value={booking.address.comp}
                      onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, comp: sanitizeInput(e.target.value) } }))}
                      placeholder={lang === 'en' ? "Room Nº" : "Nº do Quarto"} />
                  </div>
                )}

                {booking.locationType === 'motel' && (
                  <div className={`p-6 sm:p-8 rounded-[2rem] border flex items-start gap-5 sm:gap-6 animate-fade-up ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                    <div className={`shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center ${isDark ? 'bg-pink-500/20 text-pink-400' : 'bg-pink-100 text-pink-600'}`}>
                      <Icon name="heart" size={32} />
                    </div>
                    <p className={`text-base sm:text-lg font-medium leading-relaxed break-words flex-1 ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{T.motel_note}</p>
                  </div>
                )}
              </article>
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════
              STEP 2 — WHEN
          ═══════════════════════════════════════════════════════ */}
          {step === 2 && (
            <section className="animate-fade-up max-w-4xl mx-auto space-y-10 sm:space-y-12">
              <header className="text-center">
                <h2 className={`font-display text-4xl sm:text-5xl mb-4 break-words ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.select_time_title}</h2>
              </header>

              <div className={`p-5 sm:p-8 rounded-[2.5rem] border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 sm:mb-6">
                  <span className={`text-sm uppercase font-bold tracking-widest break-words ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.cart_title}</span>
                  <button onClick={() => setStep(0)} className={`text-xs sm:text-sm uppercase font-bold tracking-wider px-5 py-3 min-h-[48px] rounded-xl border transition-colors w-full sm:w-auto break-words ${isDark ? 'border-white/20 text-zinc-200 hover:text-white hover:bg-white/10' : 'border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-50'}`}>{T.cart_edit}</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {booking.cart.map(item => (
                    <span key={item.id} className={`inline-flex items-center gap-3 text-sm sm:text-base font-semibold px-4 sm:px-5 py-3 rounded-2xl border break-words ${isDark ? 'bg-blue-500/15 border-blue-500/30 text-blue-200' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
                      <Icon name={item.icon} size={20} className="shrink-0" />
                      {item.title}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative w-full max-w-full">
                <button onClick={() => scrollDates('left')} aria-label="Datas anteriores" className={`hidden md:flex absolute -left-16 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-2xl border transition-all ${isDark ? 'bg-white/10 border-white/20 text-zinc-300 hover:text-white hover:bg-white/20' : 'bg-white border-slate-300 text-slate-600 hover:text-slate-900 shadow-sm'} shadow-lg`}><Icon name="chevron-left" size={24} /></button>
                <div ref={dateScrollRef} className="flex gap-4 overflow-x-auto snap-x px-1 py-4 scrollbar-hide w-full">
                  {daysArray.map((d, idx) => {
                    const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                    const mo = d.toLocaleDateString(lang === 'en' ? CONFIG.LOCALE_EN : CONFIG.LOCALE_PT, { month: 'short' }).replace('.', '');
                    return (
                      <button key={idx} onClick={() => { setBooking(b => ({ ...b, date: d.toISOString(), time: null })); vibrate(30); }} aria-pressed={isSel}
                        className={`snap-center shrink-0 w-20 sm:w-24 min-h-[110px] sm:min-h-[128px] h-auto py-3 rounded-[1.5rem] sm:rounded-3xl flex flex-col items-center justify-center gap-2 transition-all duration-300 border ${isSel ? 'bg-blue-600 border-blue-400 text-white scale-[1.05] shadow-xl shadow-blue-900/30' : isDark ? 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white hover:border-white/20' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 shadow-sm'}`}>
                        <span className={`text-xs uppercase font-bold tracking-wider ${isSel ? 'text-blue-200' : ''}`}>{mo}</span>
                        <span className={`font-display text-3xl sm:text-4xl leading-none ${isSel ? 'text-white' : isDark ? 'text-white' : 'text-slate-900'}`}>{d.getDate()}</span>
                        <span className={`text-xs uppercase font-bold tracking-wider break-words text-center px-1 ${isSel ? 'text-blue-200' : ''}`}>{getDayLabel(d)}</span>
                      </button>
                    );
                  })}
                </div>
                <button onClick={() => scrollDates('right')} aria-label="Próximas datas" className={`hidden md:flex absolute -right-16 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-2xl border transition-all ${isDark ? 'bg-white/10 border-white/20 text-zinc-300 hover:text-white hover:bg-white/20' : 'bg-white border-slate-300 text-slate-600 hover:text-slate-900 shadow-sm'} shadow-lg`}><Icon name="chevron-right" size={24} /></button>
              </div>

              {!booking.date && (
                <div className={`text-center py-20 sm:py-24 rounded-[2.5rem] border border-dashed flex flex-col items-center gap-5 ${hasErrorGlobal ? 'animate-shake' : ''} ${isDark ? 'border-white/20 text-zinc-500' : 'border-slate-300 text-slate-500'}`}>
                  <Icon name="calendar" size={48} className="opacity-50" />
                  <p className="text-base font-semibold uppercase tracking-widest break-words px-4">{T.empty_date}</p>
                </div>
              )}

              {booking.date && generateTimeSlots.length > 0 && (
                <div className={`space-y-8 sm:space-y-10 animate-fade-up ${hasErrorGlobal && !booking.time ? 'animate-shake' : ''}`}>
                  {[
                    { key: 'morning', label: T.morning, icon: 'sunrise', slots: groupedTimeSlots.morning },
                    { key: 'afternoon', label: T.afternoon, icon: 'sun', slots: groupedTimeSlots.afternoon },
                    { key: 'evening', label: T.evening, icon: 'sunset', slots: groupedTimeSlots.evening },
                  ].filter(g => g.slots.length > 0).map(group => (
                    <div key={group.key}>
                      <div className={`flex items-center gap-3 mb-5 text-sm uppercase font-bold tracking-widest break-words ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                        <Icon name={group.icon} size={20} className="shrink-0" />
                        {group.label}
                      </div>
                      <div className="grid grid-cols-2 min-[360px]:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                        {group.slots.map(t => {
                          const isRush = RUSH_HOURS.includes(t) && booking.locationType !== 'motel';
                          const isSel = booking.time === t;
                          return (
                            <button key={t} onClick={() => { setBooking(b => ({ ...b, time: t })); vibrate(30); }} aria-pressed={isSel}
                              className={`relative flex flex-col items-center justify-center p-3 sm:py-4 sm:px-2 rounded-2xl border text-base sm:text-lg font-bold transition-all duration-200 min-h-[64px] w-full ${isSel
                                ? isRush ? 'bg-amber-500 border-amber-400 text-zinc-950 scale-[1.02] shadow-lg' : 'bg-blue-600 border-blue-400 text-white scale-[1.02] shadow-lg shadow-blue-900/40'
                                : isDark
                                  ? isRush ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20' : 'bg-white/5 border-white/10 text-zinc-200 hover:bg-white/10 hover:border-white/20'
                                  : isRush ? 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100' : 'bg-white border-slate-300 text-slate-800 hover:border-slate-400 shadow-sm'}`}>
                              {t}
                              {isRush && <span className={`text-[10px] sm:text-xs uppercase tracking-widest mt-1 block break-words text-center ${isSel ? 'text-amber-950 font-bold' : isDark ? 'text-amber-400' : 'text-amber-700'}`}>+{formatMoney(RUSH_FEE, lang).replace('R$ ', 'R$')}</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {Object.values(groupedTimeSlots).flat().some(t => RUSH_HOURS.includes(t)) && booking.locationType !== 'motel' && (
                    <div className={`flex items-start gap-4 sm:gap-5 p-6 sm:p-8 rounded-3xl border text-sm sm:text-base leading-relaxed font-medium mt-8 ${isDark ? 'bg-amber-500/10 border-amber-500/30 text-amber-200' : 'bg-amber-50 border-amber-300 text-amber-900'}`}>
                      <Icon name="alert-circle" size={28} className="shrink-0 mt-0.5 sm:mt-1" />
                      <p className="break-words flex-1">{lang === 'en' ? 'Rush hour slots (noon/late afternoon) include a small displacement fee.' : 'Você selecionou um horário de pico (meio-dia/fim de tarde). Ele tem uma pequena taxa de deslocamento.'}</p>
                    </div>
                  )}
                </div>
              )}

              {booking.date && generateTimeSlots.length === 0 && (
                <div className={`text-center py-20 sm:py-24 rounded-[2.5rem] border ${isDark ? 'border-white/10 text-zinc-400' : 'border-slate-300 text-slate-500'}`}>
                  <p className="text-lg font-medium break-words px-4">{T.empty_slots}</p>
                </div>
              )}
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════
              STEP 3 — SUMMARY & PAYMENT
          ═══════════════════════════════════════════════════════ */}
          {step === 3 && (
            <section className="animate-fade-up space-y-8 sm:space-y-10 max-w-5xl mx-auto">
              <SmartTimer isDark={isDark} text={T.timer_text} />

              <article className={`p-6 sm:p-10 rounded-[2.5rem] border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                <h3 className={`font-display text-2xl sm:text-3xl mb-3 break-words ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.extras_title}</h3>
                <p className={`text-sm sm:text-base mb-8 break-words ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{lang === 'en' ? 'Optional add-ons for your experience.' : 'Deseja adicionar algo extra para deixar a experiência mais completa?'}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {DATA.extras.map((ex: any) => {
                    const price = booking.cart.some(i => i.type === 'pack') ? Math.floor(ex.price * 0.8) : ex.price;
                    const isActive = booking.extras[ex.id];
                    return (
                      <button key={ex.id} onClick={() => { setBooking(b => ({ ...b, extras: { ...b.extras, [ex.id]: !b.extras[ex.id] } })); vibrate(30); }}
                        role="switch" aria-checked={isActive}
                        className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 sm:p-6 rounded-[2rem] border text-left cursor-pointer transition-all duration-300 min-h-[100px] w-full gap-4 ${isActive ? 'bg-blue-600/15 border-blue-500/50 shadow-md' : isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20' : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white'}`}>
                        <div className="flex items-start gap-4 sm:gap-5 min-w-0 flex-1">
                          <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${isActive ? 'bg-blue-500 text-white' : isDark ? 'bg-white/10 text-zinc-300' : 'bg-white border border-slate-300 text-slate-600'}`}>
                            <Icon name={ex.icon} size={24} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={`text-base sm:text-lg font-semibold break-words ${isActive ? isDark ? 'text-blue-300' : 'text-blue-700' : isDark ? 'text-white' : 'text-slate-900'}`}>{ex.label}</p>
                            <p className={`text-xs sm:text-sm mt-1.5 leading-relaxed font-medium break-words ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{ex.desc}</p>
                          </div>
                        </div>
                        <span className={`text-xs font-bold tracking-wider px-4 py-2 rounded-xl whitespace-nowrap shrink-0 self-start sm:self-auto transition-colors ${isActive ? 'bg-blue-600 text-white' : isDark ? 'bg-white/10 text-zinc-300' : 'bg-slate-200 text-slate-800'}`}>
                          +{formatMoney(price, lang)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </article>

              <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 sm:gap-10">
                <article className={`p-6 sm:p-10 rounded-[2.5rem] border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <h3 className={`font-display text-2xl sm:text-3xl mb-8 sm:mb-10 flex items-center gap-3 sm:gap-4 break-words ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <Icon name="file-text" size={32} className={`shrink-0 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`} />
                    <span className="break-words">{T.summary_title}</span>
                  </h3>

                  <div className="space-y-8">
                    <div>
                      <p className={`text-xs sm:text-sm uppercase font-bold tracking-widest mb-4 sm:mb-5 break-words ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{T.summary_items}</p>
                      <div className="space-y-4">
                        {booking.cart.map((item, i) => (
                          <div key={i} className={`flex flex-col min-[400px]:flex-row justify-between min-[400px]:items-center gap-2 min-[400px]:gap-4 text-base sm:text-lg font-semibold border-b pb-4 last:border-0 last:pb-0 ${isDark ? 'border-white/10 text-zinc-200' : 'border-slate-200 text-slate-800'}`}>
                            <span className="min-w-0 break-words flex-1">{item.title}</span>
                            <span className={`shrink-0 whitespace-nowrap text-left min-[400px]:text-right ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{formatMoney(item.price, lang)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {Object.keys(booking.extras || {}).filter(k => booking.extras[k]).length > 0 && (
                      <div className={`border-t pt-8 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                        <p className={`text-xs sm:text-sm uppercase font-bold tracking-widest mb-4 sm:mb-5 break-words ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{T.summary_extras}</p>
                        <div className="space-y-3">
                          {Object.keys(booking.extras || {}).filter(k => booking.extras[k]).map(k => {
                            const ex = DATA.extras.find((e: any) => e.id === k);
                            if (!ex) return null;
                            const price = booking.cart.some(i => i.type === 'pack') ? Math.floor(ex.price * 0.8) : ex.price;
                            return (
                              <div key={k} className={`flex flex-col min-[400px]:flex-row justify-between min-[400px]:items-center gap-1 min-[400px]:gap-4 text-base sm:text-lg font-medium mb-3 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                                <span className="min-w-0 break-words flex-1">{ex.label}</span>
                                <span className="shrink-0 whitespace-nowrap text-left min-[400px]:text-right">+{formatMoney(price, lang)}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className={`border-t pt-8 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                      <p className={`text-xs sm:text-sm uppercase font-bold tracking-widest mb-4 sm:mb-5 break-words ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{T.summary_info}</p>
                      <div className="space-y-4 text-base sm:text-lg font-medium">
                        <div className={`flex items-start gap-4 ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                          <Icon name="calendar" size={24} className="text-blue-500 shrink-0 mt-0.5" />
                          <span className="break-words flex-1">
                            {booking.date ? new Date(booking.date).toLocaleDateString(lang === 'en' ? CONFIG.LOCALE_EN : CONFIG.LOCALE_PT) : ''} {lang === 'en' ? 'at' : 'às'} {booking.time}
                          </span>
                        </div>
                        <div className={`flex items-start gap-4 ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                          <Icon name="map-pin" size={24} className="text-blue-500 shrink-0 mt-0.5" />
                          <span className="break-words flex-1">{booking.locationType === 'home' ? T.summary_loc_home : booking.locationType === 'motel' ? T.summary_loc_motel : T.summary_loc_hotel}</span>
                        </div>
                        <div className={`flex items-start gap-4 ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                          <Icon name="clock" size={24} className="text-blue-500 shrink-0 mt-0.5" />
                          <span className="break-words flex-1">Tempo estimado: {financials.duration} min</span>
                        </div>
                      </div>
                    </div>

                    <div className={`border-t pt-8 space-y-4 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                      <div className={`flex flex-col min-[400px]:flex-row justify-between min-[400px]:items-center gap-1 min-[400px]:gap-5 text-base sm:text-lg font-semibold ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                        <span className="break-words">{T.subtotal}</span>
                        <span className="shrink-0 whitespace-nowrap text-left min-[400px]:text-right">{formatMoney(financials.sub, lang)}</span>
                      </div>
                      {booking.appliedCoupon && (
                        <div className={`flex flex-col min-[400px]:flex-row justify-between min-[400px]:items-center gap-1 min-[400px]:gap-5 text-base sm:text-lg font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                          <span className="flex items-start gap-3 min-w-0 flex-1 break-words"><Icon name="gift" size={20} className="shrink-0 mt-0.5" />{booking.appliedCoupon.title}</span>
                          <span className="shrink-0 whitespace-nowrap text-left min-[400px]:text-right">-{formatMoney(financials.disc, lang)}</span>
                        </div>
                      )}
                      {financials.mediaDisc > 0 && (
                        <div className={`flex flex-col min-[400px]:flex-row justify-between min-[400px]:items-center gap-1 min-[400px]:gap-5 text-base sm:text-lg font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                          <span className="break-words">{T.media_discount}</span>
                          <span className="shrink-0 whitespace-nowrap text-left min-[400px]:text-right">-{formatMoney(financials.mediaDisc, lang)}</span>
                        </div>
                      )}
                      {financials.pixDisc > 0 && (
                        <div className={`flex flex-col min-[400px]:flex-row justify-between min-[400px]:items-center gap-1 min-[400px]:gap-5 text-base sm:text-lg font-semibold ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                          <span className="break-words">{T.pix_discount}</span>
                          <span className="shrink-0 whitespace-nowrap text-left min-[400px]:text-right">-{formatMoney(financials.pixDisc, lang)}</span>
                        </div>
                      )}
                      {financials.rushFee > 0 && (
                        <div className={`flex flex-col min-[400px]:flex-row justify-between min-[400px]:items-center gap-1 min-[400px]:gap-5 text-base sm:text-lg font-semibold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                          <span className="flex items-start gap-3 min-w-0 flex-1 break-words"><Icon name="car" size={20} className="shrink-0 mt-0.5" />{T.msg_rush_fee}</span>
                          <span className="shrink-0 whitespace-nowrap text-left min-[400px]:text-right">+{formatMoney(financials.rushFee, lang)}</span>
                        </div>
                      )}

                      <div className={`flex flex-col sm:flex-row justify-between gap-3 sm:items-end pt-6 mt-4 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                        <span className={`text-sm sm:text-base uppercase font-bold tracking-widest shrink-0 break-words ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.total_label}</span>
                        <div className="text-left sm:text-right min-w-0">
                          <p className="font-display text-4xl sm:text-5xl md:text-6xl text-gradient-blue whitespace-nowrap">{formatMoney(financials.total, lang)}</p>
                          <p className={`text-xs sm:text-sm uppercase font-bold tracking-widest mt-2 flex items-center justify-start sm:justify-end gap-2 whitespace-nowrap break-words ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                            <Icon name="sparkles" size={14} /> +{estimatedXP} {T.xp_guaranteed}
                          </p>
                        </div>
                      </div>
                    </div>

                    {booking.locationType !== 'motel' && (
                      <div className={`flex items-start gap-4 sm:gap-5 p-5 sm:p-6 rounded-2xl text-sm sm:text-base font-medium leading-relaxed border ${isDark ? 'bg-white/5 border-white/10 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                        <Icon name="car" size={24} className="shrink-0 mt-0.5" />
                        <span className="break-words flex-1">{T.uber_notice}</span>
                      </div>
                    )}
                  </div>
                </article>

                <div className="space-y-6 sm:space-y-8">
                  <article className={`p-6 sm:p-8 rounded-[2.5rem] border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <h4 className={`text-lg sm:text-xl font-semibold mb-5 sm:mb-6 flex items-center gap-3 sm:gap-4 break-words ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      <Icon name="ticket" size={28} className={`shrink-0 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`} />
                      <span className="break-words">{T.coupon_section}</span>
                    </h4>

                    {user.coupons.length > 0 ? (
                      <div className="flex flex-col gap-4">
                        {user.coupons.map(c => (
                          <button key={c.id} onClick={() => { setBooking(b => ({ ...b, appliedCoupon: b.appliedCoupon?.id === c.id ? null : c })); vibrate(30); }}
                            className={`w-full p-4 sm:p-5 rounded-[1.5rem] border transition-all flex items-center justify-between gap-3 min-h-[72px] ${booking.appliedCoupon?.id === c.id ? 'bg-emerald-600/15 border-emerald-500/50 text-emerald-400 shadow-md' : isDark ? 'bg-white/5 border-white/10 text-zinc-200 hover:bg-white/10' : 'bg-slate-50 border-slate-300 text-slate-800 hover:bg-white'}`}>
                            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${booking.appliedCoupon?.id === c.id ? 'bg-emerald-500 text-white' : isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
                                <Icon name="gift" size={20} />
                              </div>
                              <span className="text-sm sm:text-base font-bold tracking-wide text-left break-words line-clamp-2">{c.title}</span>
                            </div>
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${booking.appliedCoupon?.id === c.id ? 'bg-emerald-500 border-emerald-500 text-white' : isDark ? 'border-white/30' : 'border-slate-300'}`}>
                              {booking.appliedCoupon?.id === c.id && <Icon name="check" size={18} />}
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className={`p-5 sm:p-6 rounded-2xl border border-dashed text-center text-sm sm:text-base font-medium break-words ${isDark ? 'border-white/20 text-zinc-500' : 'border-slate-300 text-slate-500'}`}>
                        {T.coupon_empty}
                      </div>
                    )}
                  </article>

                  <article className={`p-6 sm:p-8 rounded-[2.5rem] border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="flex items-start gap-4 sm:gap-5 mb-5 sm:mb-6">
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 ${isDark ? 'bg-white/10 text-zinc-300' : 'bg-slate-100 text-slate-600'}`}>
                        <Icon name="camera" size={28} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className={`text-lg sm:text-xl font-semibold mb-1 sm:mb-2 break-words ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.media_title}</h4>
                        <p className={`text-xs sm:text-sm leading-relaxed font-medium break-words ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{T.media_desc}</p>
                      </div>
                    </div>
                    <button onClick={() => { setBooking(b => ({ ...b, mediaAllowed: !b.mediaAllowed })); vibrate(30); }}
                      className={`w-full flex flex-col sm:flex-row items-center sm:justify-between p-4 sm:p-5 rounded-2xl border transition-all gap-3 text-xs sm:text-sm font-bold uppercase tracking-widest min-h-[64px] ${booking.mediaAllowed ? 'bg-blue-600/20 border-blue-500/50 text-blue-300' : isDark ? 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:text-zinc-200' : 'bg-slate-50 border-slate-300 text-slate-600 hover:border-slate-400 hover:bg-white'}`}>
                      <span className="break-words text-center sm:text-left w-full sm:w-auto">{booking.mediaAllowed ? T.media_granted : T.media_support}</span>
                      <span className={`px-4 py-2 rounded-xl whitespace-nowrap w-full sm:w-auto text-center ${booking.mediaAllowed ? 'bg-blue-600 text-white' : isDark ? 'bg-white/10' : 'bg-slate-200'}`}>{T.media_bonus}</span>
                    </button>
                  </article>

                  <article className={`p-6 sm:p-8 rounded-[2.5rem] border ${hasErrorGlobal && !booking.payment ? 'animate-shake' : ''} ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <h4 className={`text-lg sm:text-xl font-semibold mb-5 sm:mb-6 break-words ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.payment_title}</h4>
                    <div className="space-y-4">
                      {[
                        { id: 'pix', label: T.pay_pix, icon: 'smartphone', note: lang === 'en' ? 'Copy key' : 'Copiar chave' },
                        { id: 'card', label: T.pay_card, icon: 'credit-card', note: null },
                        { id: 'money', label: T.pay_cash, icon: 'banknote', note: null }
                      ].map(p => (
                        <button key={p.id} onClick={() => {
                          setBooking(b => ({ ...b, payment: p.id }));
                          vibrate(30);
                          if (p.id === 'pix') { navigator.clipboard.writeText(CONFIG.PIX_KEY); addToast(T.toast_pix_copied); }
                        }}
                          className={`w-full flex items-center gap-4 sm:gap-5 p-4 sm:p-5 min-h-[72px] rounded-2xl border transition-all duration-300 ${booking.payment === p.id ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/30 scale-[1.02]' : isDark ? 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 hover:border-white/20' : 'bg-slate-50 border-slate-300 text-slate-800 hover:border-slate-400 hover:bg-white'}`}>
                          <Icon name={p.icon} size={28} className="shrink-0" />
                          <span className="flex-1 text-left text-sm sm:text-base font-bold tracking-wide break-words">{p.label}</span>
                          {p.id === 'pix' && booking.payment === 'pix' && (
                            <span className="hidden sm:inline-block text-xs font-bold bg-white/20 px-3 py-1.5 rounded-xl whitespace-nowrap">{p.note}</span>
                          )}
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${booking.payment === p.id ? 'border-white' : isDark ? 'border-white/30' : 'border-slate-300'}`}>
                            {booking.payment === p.id && <div className="w-3 h-3 rounded-full bg-white" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </article>

                  <article className={hasErrorGlobal && !booking.termsAccepted ? 'animate-shake' : ''}>
                    <button onClick={() => setTermsOpen(true)}
                      className={`w-full flex flex-col sm:flex-row items-center sm:justify-between p-6 sm:p-8 rounded-[2.5rem] border cursor-pointer transition-all duration-300 min-h-[100px] gap-4 ${booking.termsAccepted ? isDark ? 'bg-emerald-600/20 border-emerald-500/50' : 'bg-emerald-50 border-emerald-400' : isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'}`}>
                      <div className="flex items-center gap-4 sm:gap-5 min-w-0 flex-1 w-full">
                        <div className={`shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center ${booking.termsAccepted ? isDark ? 'bg-emerald-600/30 text-emerald-400' : 'bg-emerald-100 text-emerald-700' : isDark ? 'bg-white/10 text-zinc-300' : 'bg-slate-100 text-slate-600'}`}>
                          <Icon name="heart" size={28} />
                        </div>
                        <div className="min-w-0 text-left flex-1">
                          <p className={`text-base sm:text-lg font-bold break-words ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.terms_title}</p>
                          <p className={`text-xs sm:text-sm mt-1 font-medium break-words ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.terms_read}</p>
                        </div>
                      </div>
                      <div onClick={e => { e.stopPropagation(); vibrate(30); setBooking(b => ({ ...b, termsAccepted: !b.termsAccepted })); }}
                        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 transition-all mt-2 sm:mt-0 ${booking.termsAccepted ? 'bg-emerald-600 border-emerald-500 text-white shadow-md' : isDark ? 'border-white/30' : 'border-slate-300'}`}>
                        {booking.termsAccepted && <Icon name="check" size={20} />}
                      </div>
                    </button>
                  </article>
                </div>
              </div>
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════
              STEP 4 — SUCCESS
          ═══════════════════════════════════════════════════════ */}
          {step === 4 && (
            <section className="min-h-[80vh] flex flex-col items-center justify-center text-center animate-scale-in max-w-lg mx-auto px-5 pt-12">
              <div className="relative mb-12">
                <div className="absolute inset-0 rounded-full animate-ping" style={{ background: 'rgba(16,185,129,0.2)', animationDuration: '1.8s' }} />
                <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 80px 30px rgba(16,185,129,0.15)' }} />
                <div className={`relative w-32 h-32 sm:w-40 sm:h-40 rounded-full flex items-center justify-center border-[4px] border-emerald-500/50 ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                  <Icon name="check" size={64} className="text-emerald-400" />
                </div>
              </div>

              <h2 className={`font-display text-4xl sm:text-5xl mb-6 break-words px-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.success_title}</h2>
              <p className={`text-base sm:text-lg leading-relaxed mb-10 sm:mb-12 max-w-md break-words ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{T.success_sub}</p>

              <div className={`w-full p-6 sm:p-8 rounded-[2.5rem] border mb-10 sm:mb-12 text-left space-y-4 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className={`flex items-center gap-4 text-base sm:text-lg font-medium break-words ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                  <Icon name="user" size={24} className="text-blue-500 shrink-0" />
                  <span className="flex-1 break-words">{user.name}</span>
                </div>
                <div className={`flex items-start gap-4 text-base sm:text-lg font-medium break-words ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                  <Icon name="calendar" size={24} className="text-blue-500 shrink-0 mt-0.5" />
                  <span className="flex-1 break-words">
                    {booking.date ? new Date(booking.date).toLocaleDateString(lang === 'en' ? CONFIG.LOCALE_EN : CONFIG.LOCALE_PT) : ''} {lang === 'en' ? 'at' : 'às'} {booking.time}
                  </span>
                </div>
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between pt-6 mt-2 border-t gap-2 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                  <span className="font-bold uppercase tracking-widest text-sm shrink-0 text-zinc-500 break-words">{T.total_label}</span>
                  <span className="font-display text-4xl sm:text-5xl text-gradient-blue whitespace-nowrap">{formatMoney(financials.total, lang)}</span>
                </div>
              </div>

              <div className="w-full space-y-4 sm:space-y-5">
                <Button variant="whatsapp" size="xl" full icon="message" onClick={() => openExternal('whatsapp', generateWhatsAppMsg())}>
                  {T.whatsapp_btn}
                </Button>
                <button onClick={() => { setStep(0); setBooking({ ...booking, cart: [], termsAccepted: false, appliedCoupon: null, bookingId: `BOOK_${Date.now()}`, mediaAllowed: false }); }}
                  className={`w-full text-sm sm:text-base font-bold uppercase tracking-widest py-5 sm:py-6 transition-colors min-h-[64px] break-words ${isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-500 hover:text-slate-800'}`}>
                  {T.back_home}
                </button>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* ── STICKY BOTTOM NAV ── */}
      {step >= 0 && step < 4 && booking.cart.length > 0 && (
        <nav className="fixed bottom-0 inset-x-0 px-3 sm:px-6 pb-4 sm:pb-6 pt-2 sm:pt-4 z-40 animate-slide-up pointer-events-none w-full">
          <div className={`max-w-5xl mx-auto pointer-events-auto rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border shadow-[0_-10px_50px_rgba(0,0,0,0.3)] ${isDark ? 'bg-[#181c25]/95 backdrop-blur-xl border-zinc-700' : 'bg-white/95 backdrop-blur-xl border-slate-300'}`}>
            <div className="flex items-center justify-between gap-3 sm:gap-4 px-4 py-3 sm:px-8 sm:py-6">
              
              {step > 0 && (
                <button onClick={() => { setStep(s => s - 1); vibrate(30); }} aria-label="Voltar etapa"
                  className={`w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-xl sm:rounded-2xl border transition-all shrink-0 ${isDark ? 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700' : 'border-slate-300 bg-slate-50 text-slate-600 hover:text-slate-900'}`}>
                  <Icon name="chevron-left" size={24} />
                </button>
              )}

              <div className="flex-1 min-w-0 pl-1 sm:pl-2">
                <p className={`text-[10px] sm:text-sm uppercase font-bold tracking-widest mb-0.5 sm:mb-1 truncate ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  {step === 0 ? `${booking.cart.length} ${T.items_selected}` : step === 3 ? T.total_label : T.subtotal}
                </p>
                <p className={`font-display text-xl sm:text-3xl leading-none whitespace-nowrap ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {step === 3 ? formatMoney(financials.total, lang) : formatMoney(financials.sub, lang)}
                </p>
              </div>

              <button onClick={handleNextStep} aria-label={step === 3 ? T.finish_btn : T.next_btn}
                className={`relative h-12 sm:h-16 flex items-center gap-2 sm:gap-3 px-5 sm:px-10 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-base uppercase tracking-wider transition-all duration-200 shrink-0 overflow-hidden min-w-[120px] sm:min-w-[160px] ${isStepValid()
                  ? step === 3
                    ? 'bg-[#25D366] text-white hover:bg-[#22c55e] shadow-lg shadow-green-900/40 hover:-translate-y-1 active:scale-95'
                    : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/40 hover:-translate-y-1 active:scale-95'
                  : isDark ? 'bg-zinc-800 border border-zinc-700 text-zinc-500' : 'bg-slate-100 border border-slate-300 text-slate-400'}`}>
                {step === 3 ? (
                  <><Icon name="message" size={20} className="hidden sm:block" /><Icon name="message" size={16} className="sm:hidden" /><span className="hidden sm:inline break-words">{T.finish_btn}</span><span className="sm:hidden break-words">{T.btn_finish_short}</span></>
                ) : (
                  <><span className="hidden sm:inline break-words">{T.next_btn}</span><span className="sm:hidden break-words">{T.btn_next_short}</span><Icon name="chevron-right" size={20} className="hidden sm:block" /><Icon name="chevron-right" size={16} className="sm:hidden" /></>
                )}
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* ── TERMS MODAL ── */}
      {termsOpen && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in">
          <div role="dialog" aria-modal="true" aria-label={T.terms_title} className={`relative w-full max-w-2xl max-h-[90vh] sm:max-h-[85vh] rounded-[2.5rem] sm:rounded-[3rem] flex flex-col border shadow-2xl animate-slide-up ${isDark ? 'bg-[#11141a] border-zinc-700' : 'bg-white border-slate-300'}`}>
            <div className={`flex items-center justify-between p-6 sm:p-10 border-b shrink-0 gap-4 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              <h3 className={`font-display text-2xl sm:text-3xl break-words flex-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.rules_complete}</h3>
              <button onClick={() => setTermsOpen(false)} aria-label="Fechar regras" className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors shrink-0 ${isDark ? 'text-zinc-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}>
                <Icon name="x" size={24} />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-6 sm:p-10 space-y-5 sm:space-y-6">
              {DATA.rules.map((rule: Rule, i: number) => <RuleItem key={i} rule={rule} isDark={isDark} />)}
            </div>
            <div className={`p-6 sm:p-10 border-t shrink-0 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              <Button full size="xl" onClick={() => { setBooking(b => ({ ...b, termsAccepted: true })); vibrate(30); setTermsOpen(false); }}>{T.agree_terms}</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── WELCOME POPUP ── */}
      {welcomePopup && (
        <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-4 sm:p-6 bg-black/95 backdrop-blur-md animate-fade-in">
          <div role="dialog" aria-modal="true" aria-label={T.welcome_popup_title} className={`relative w-full max-w-lg rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-12 border shadow-2xl animate-scale-in overflow-hidden ${isDark ? 'bg-[#11141a] border-zinc-700' : 'bg-white border-slate-300'}`}>
            <div className="absolute top-0 right-0 w-64 h-64 sm:w-80 sm:h-80 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-[2rem] flex items-center justify-center mb-6 sm:mb-8 ${isDark ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-blue-50 text-blue-600 border border-blue-200'}`}>
              <Icon name="gift" size={32} className="sm:w-10 sm:h-10" />
            </div>
            <h3 className={`font-display text-3xl sm:text-4xl mb-3 sm:mb-4 break-words ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.welcome_popup_title}</h3>
            <p className={`text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 break-words ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{T.welcome_popup_msg}</p>

            <div className={`text-xs sm:text-sm font-medium p-4 sm:p-5 rounded-xl sm:rounded-2xl border mb-6 sm:mb-8 break-words ${isDark ? 'bg-amber-900/30 border-amber-700/50 text-amber-200' : 'bg-amber-50 border-amber-300 text-amber-800'}`}>
              {T.welcome_popup_warning}
            </div>

            <div className={`p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-dashed mb-8 sm:mb-10 text-center break-words ${isDark ? 'border-blue-500/40 bg-blue-500/10' : 'border-blue-300 bg-blue-50/50'}`}>
              <p className={`text-xs uppercase font-bold tracking-widest mb-2 sm:mb-3 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{lang === 'en' ? 'Your first gift' : 'Seu presente inaugural'}</p>
              <p className={`font-display text-4xl sm:text-5xl tracking-widest ${isDark ? 'text-white' : 'text-slate-900'}`}>BEMVINDO10</p>
            </div>

            <Button full size="xl" onClick={() => {
              setWelcomePopup(false);
              vibrate([50, 100]);
              const c: Coupon = { id: 'welcome', val: 10, title: 'BEMVINDO10', code: 'BEMVINDO10' };
              setUser(u => ({ ...u, hasSeenWelcome: true, coupons: [...u.coupons, c] }));
              setBooking(b => ({ ...b, appliedCoupon: c }));
              addToast(T.toast_coupon_success);
            }}>{T.get_coupon}</Button>
          </div>
        </div>
      )}

      {/* ── LEVEL UP POPUP ── */}
      {levelUpPopup && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6 bg-black/95 backdrop-blur-md animate-fade-in">
          <div role="dialog" aria-modal="true" aria-label={T.levelup_popup_title} className={`relative w-full max-w-lg rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-12 text-center border shadow-2xl animate-scale-in overflow-hidden ${isDark ? 'bg-[#11141a] border-amber-700/50' : 'bg-white border-amber-300'}`}>
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-80 h-80 sm:w-96 sm:h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className={`w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-[2rem] sm:rounded-[2.5rem] flex items-center justify-center mb-6 sm:mb-8 bg-gradient-to-br from-amber-400 to-amber-600 text-zinc-950 shadow-2xl shadow-amber-500/30 animate-bounce-slow relative z-10`}>
              <Icon name="trophy" size={40} className="sm:w-12 sm:h-12" />
            </div>

            <h3 className={`font-display text-4xl sm:text-5xl mb-3 sm:mb-4 relative z-10 break-words ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.levelup_popup_title}</h3>
            <p className={`text-base sm:text-lg leading-relaxed font-medium mb-8 sm:mb-10 relative z-10 break-words ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{T.levelup_popup_msg}</p>

            <Button full size="xl" variant="amber" onClick={() => { setLevelUpPopup(false); vibrate(50); }} className="relative z-10">
              {T.level_redeem}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
