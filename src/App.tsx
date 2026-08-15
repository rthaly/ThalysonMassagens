import React, { useState, useEffect, useMemo, useRef, useCallback, memo } from 'react';

// ==================================================================================
// DESIGN TOKENS & CONFIG
// ==================================================================================
const CONFIG = {
  PHONE: "5517991360413",
  INSTAGRAM_URL: "https://instagram.com/relaxarhojesp",
  STORAGE_KEY: '@thaly_app_v27_premium_plans',
  PIX_KEY: "62.922.530/0001-14",
  LOCALE_PT: 'pt-BR',
  LOCALE_EN: 'en-US',
  EXCHANGE_RATE: 5.0,
  SECRET_TOKEN: 'THALY_SECURE_V12',
  START_HOUR: 9,
  END_HOUR: 22,
  MAX_STORAGE_SIZE: 5000
} as const;

const RUSH_HOURS = ['12:00', '13:00', '17:00', '18:00', '19:00'];
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
  'user': 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  'home': 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
  'bed': 'M2 4v16 M2 8h18a2 2 0 0 1 2 2v10 M2 17h20 M6 8v9',
  'building': 'M4 22v-17a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v17 M4 22h16 M10 22V10h4v12 M14 6h.01 M10 6h.01',
  'map-pin': 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  'car': 'M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2 M7 17v4h2v-4 M15 17v4h2v-4',
  'calendar': 'M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  'calendar-plus': 'M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8 M16 2v4 M8 2v4 M3 10h18 M19 16v6 M16 19h6',
  'smartphone': 'M5 2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z M12 18h.01',
  'message': 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8.9h.5a8.48 8.48 0 0 1 8 8v.5z',
  'credit-card': 'M3 10h18 M7 15h.01 M11 15h2 M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z',
  'banknote': 'M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M5 8h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z',
  'shield': 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  'shower': 'M12 4v4 M12 8l-2 2 M12 8l2 2 M7.5 12.5L5 15 M14 12.5L21.5 15 M10 15l-1 4 M16 15l1 4 M4 8h16',
  'hand': 'M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3',
  'clock': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2',
  'award': 'M12 15l-2 5-9-9 9-9 9 9-9 9-2-5',
  'trophy': 'M8 21h8M12 17v4m9-13.5a2.5 2.5 0 0 0-5 0v3a2.5 2.5 0 0 0 5 0v-3zM3 7.5a2.5 2.5 0 0 1 5 0v3a2.5 2.5 0 0 1-5 0v-3zM9 4.5h6',
  'gift': 'M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7 M16 8h-4 M4 8h16a2 2 0 0 1 2 2v2H2v-2a2 2 0 0 1 2-2z M12 8V4 M12 8V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4 M12 8V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4',
  'scissors': 'M6 9L12 15 18 9 M6 20a3 3 0 0 1-3-3v-6l6 6v3z M18 20a3 3 0 0 0 3-3v-6l-6 6v3z',
  'file-text': 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  'heart': 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  'instagram': 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M2 8a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8z',
  'plus': 'M12 5v14 M5 12h14',
  'refresh-cw': 'M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0 0 20.49 15',
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
    @keyframes pulse-slow { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .9; transform: scale(0.98); } }
    
    .animate-fade-up { animation: fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-fade-in { animation: fadeIn 0.3s ease forwards; }
    .animate-scale-in { animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
    .animate-toast-in { animation: toast-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
    .animate-slide-right { animation: slideRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }

    .card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease; }
    @media (hover: hover) { .card-hover:hover { transform: translateY(-2px); } }
    .service-card-selected { box-shadow: 0 0 0 2px var(--c-blue), 0 8px 24px rgba(59,130,246,0.15); }
    .service-card-selected-amber { box-shadow: 0 0 0 2px var(--c-amber), 0 8px 24px rgba(245,158,11,0.15); }

    button { position: relative; overflow: hidden; cursor: pointer; border: none; }
    .input-field:focus { outline: none; border-color: var(--c-blue); box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }

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
const Icon = memo(({ name, size = 24, className = '' }: { name: string; size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`} aria-hidden="true">
    <path d={ICON_PATHS[name] || ''} />
  </svg>
));

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
// DATA & COPY STRATEGY (CLEAR BOUNDARIES, TANGIBILITY & SIGIL)
// ==================================================================================
const getFullReviews = (lang: 'pt' | 'en'): Review[] => {
  return [
   { n: "João", loc: "Suíte Do Massagista,Bela Vista - SP", t: "Thalyson muito obrigado!! 
Amei de verdade, consegui relaxar e me entregar de verdade! 
Normalmente finalizo rápido quando é só putaria!! Mas com você no toque no pele com pele, consegui relaxar aproveitar e ir mais longe!! foi pra outro nível! 
Muito obrigado e parabéns pelo trabalho!, serv: "Experiência Nuru", s: 5 },

    { n: "Gustavo H.", loc: "Bela Vista - SP", t: "O Thalyson foi extremamente profissional. O toque pele a pele da massagem Fusion me deixou nas nuvens. A finalização no Lingam tirou todo meu estresse. Discrição total.", serv: "Experiência Fusion", s: 5 },
    { n: "L. (Sigiloso)", loc: "Santa Fé do Sul", t: "Precisava desse alívio sem julgamentos. Sou casado, o sigilo foi perfeito e a massagem sensitiva me fez redescobrir o prazer de relaxar.", serv: "Massagem Sensitiva", s: 5 },
    { n: "Anônimo", loc: "Hotel - SP", t: "Estava de passagem a trabalho. O gel deslizando pelo corpo foi a melhor sensação. Dormi leve igual criança.", serv: "Massagem Nuru", s: 5 },
    { n: "Ricardo", loc: "Fernandópolis", t: "Encontrei um respeito raro. Me senti à vontade para soltar minhas travas. Fui super bem atendido na suíte dele.", serv: "Experiência Fusion", s: 5 },
    { n: "Felipe", loc: "Londrina", t: "A massagem clássica é pesada na medida certa. Ele tirou uns nós das minhas costas que me atormentavam há semanas.", serv: "Massagem Clássica", s: 5 },
    // Novos Feedbacks Mais Quentes (Centro SP)
    { n: "Marcos (Sigiloso)", loc: "Consolação - SP", t: "Fui na suíte dele. Clima perfeito, luz baixa. A Nuru com aquele gel que desliza pelo corpo todo é um absurdo de gostoso. Sensibilidade a mil e um final intenso e demorado.", serv: "Massagem Nuru", s: 5 },
    { n: "Diego", loc: "República - SP", t: "Atendimento no meu apê na República. O cara manja muito. A massagem começou pegada pra tirar os nós e terminou num pele a pele de enlouquecer. O toque final no Lingam me fez desligar de tudo.", serv: "Experiência Fusion", s: 5 },
    { n: "Fernando", loc: "Jardins - SP", t: "Maluco, que mão é essa! Pedi a Nuru em casa e foi a melhor escolha. Muito gel que desliza gostoso, o corpo dele no meu... a finalização manual foi surreal de boa. Dormi pesado depois.", serv: "Massagem Nuru", s: 5 },
    { n: "C.A.", loc: "Santa Cecília - SP", t: "A liberdade de poder tocar e guiar o ritmo na Reversa, depois de relaxar com a massagem dele, foi excitante demais. Uma troca de energia f*da e muito respeito.", serv: "Massagem Reversa", s: 5 },
    { n: "Paulo (Casado)", loc: "Higienópolis - SP", t: "Sou super travado, mas o Thalyson me deixou à vontade em 5 minutos. Aquela massagem sensitiva me levou a um ápice de prazer que eu não sentia há anos. Muito discreto.", serv: "Massagem Sensitiva", s: 5 }
  ];
};

const getData = (lang: 'pt' | 'en') => {
  const isEn = lang === 'en';
  const p = {
    depil: 107, relax: 180, sens: 200, naturista: 197, titan: 250, reversa: 300, nuru: 350, pes: 110,
    pack_classic4: { v: 576, full: 720, save: 144 }, 
    pack_tantric: { v: 640, full: 800, save: 160 },  
    extras: { more_time: 77, aroma: 17, hair_trim: 57 }
  };

  return {
    levels: [
      { level: 1, xpNeeded: 0, reward: 0, title: isEn ? "Beginner" : "Iniciante no Cuidado" },
      { level: 2, xpNeeded: 100, reward: 15, title: isEn ? "Explorer" : "Explorador" },
      { level: 3, xpNeeded: 350, reward: 30, title: isEn ? "Conscious Body" : "Corpo Consciente" },
      { level: 4, xpNeeded: 800, reward: 50, title: isEn ? "Plenitude" : "Plenitude Alcançada" }
    ],
    services: [
      { id: 'pes', category: 'express', min: 40, price: p.pes, icon: "user-check", tag: isEn ? "FOOT RELIEF" : "ALÍVIO PÉS", title: isEn ? "Foot Reflexology" : "Reflexologia Podal", desc: isEn ? "Complete relief for tired feet." : "Alívio completo para pés cansados após longas jornadas.", details: isEn ? "1. Foot reflexology\n2. Deep pressure points" : "1. Reflexologia focada na sola dos pés.\n2. Pressão profunda em pontos de tensão.\n3. Alívio imediato de cansaço." },
      
      { id: 'relaxante', category: 'relax', min: 40, price: p.relax, icon: "user-check", tag: isEn ? "MUSCLE RELIEF" : "ALÍVIO MUSCULAR", title: isEn ? "Classic Massage" : "Massagem Clássica", desc: isEn ? "Full body massage focused on pain relief. No intimate touches." : "Massagem corporal terapêutica focada em tirar dores. Estritamente profissional, sem toques íntimos.", details: isEn ? "1. Full body relaxing massage.\n2. Deep tension relief.\n3. Professional session only." : "1. Massagem no corpo todo (costas, pernas, braços).\n2. Foco em nós e tensões musculares.\n3. Zero toques em áreas íntimas.\n4. Promove sono profundo e alívio do estresse." },
      
      { id: 'sensitiva', category: 'final', min: 60, price: p.sens, icon: "sparkles", tag: isEn ? "SENSUAL START" : "DESPERTAR", title: isEn ? "Sensory Massage" : "Massagem Sensitiva", desc: isEn ? "Classic massage followed by gentle touches, ending with a manual release." : "Clássica para aliviar dores, seguida de toques sutis. Finalização tântrica manual para liberação total.", details: isEn ? "1. Classic body massage.\n2. Sensory awakening.\n3. Manual release (Lingam)." : "1. Massagem para soltar a musculatura pesada.\n2. Toques sutis para despertar a sensibilidade.\n3. Foco na região íntima (Lingam) no terço final.\n4. Finalização manual para ápice do relaxamento.\n*(Obs: Não há sexo ou penetração)*" },
      { id: 'mista', category: 'final', min: 60, price: p.titan, icon: "zap", tag: isEn ? "SKIN TO SKIN" : "PELE A PELE", title: isEn ? "Fusion Experience" : "Experiência Fusion", desc: isEn ? "Body-to-body contact (I wear underwear). Intense stimulation and manual ending." : "O equilíbrio perfeito. Massagem para dores e depois muito contato físico próximo para estímulo e finalização intensa.", details: isEn ? "1. Classic massage.\n2. Skin to skin contact.\n3. Manual release." : "1. Massagem clássica para tirar as travas.\n2. Contato físico muito próximo (atendo apenas de cueca).\n3. Estímulos corporais intensos.\n4. Finalização tântrica manual (Lingam) poderosa.\n*(Obs: Sem ato sexual)*" },
      { id: 'reversa', category: 'final', min: 60, price: p.reversa, icon: "refresh-cw", tag: isEn ? "YOUR CONTROL" : "SEU CONTROLE", title: isEn ? "Reverse Massage" : "Massagem Reversa", desc: isEn ? "I start the massage, then you take control." : "Começa comigo tirando suas tensões. Depois, você assume o controle da sessão.", details: isEn ? "1. Classic massage (approx. 30 min).\n2. Control passes to you.\n3. Freedom to guide the rhythm.\n4. Mutual ending." : "1. Massagem clássica (aprox. 30 min).\n2. O controle da sessão passa para você.\n3. Liberdade total para guiar o ritmo e os toques.\n4. Finalização tântrica intensa e mútua.\n*(Obs: Sem ato sexual/penetração)*" },
      { id: 'nuru', category: 'final', min: 60, price: p.nuru, icon: "star", popular: true, tag: isEn ? "PREMIUM SLIDE" : "O ÁPICE DO PRAZER", title: isEn ? "Nuru Massage" : "Massagem Nuru (Com Gel)", desc: isEn ? "Full body sliding with gliding gel. Total surrender with an intense manual ending." : "A mais pedida. Muito gel que desliza pelo corpo todo, contato fluido costas e frente, e massagem no Lingam. Relaxamento extremo.", details: isEn ? "1. Naked sliding massage.\n2. Special gliding gel.\n3. Lingam massage ending." : "1. Nós dois sem roupas desde o início.\n2. Deslizamento fluido e contínuo corpo a corpo com gel especial.\n3. Massagem intensa focada no Pênis (Lingam).\n4. Finalização manual para você gozar e esvaziar a mente.\n*(Obs: Foco no seu prazer manual, não realizo penetração).*." },
      
      { id: 'depilacao', category: 'care', min: 60, price: p.depil, icon: "scissors", tag: isEn ? "AESTHETICS" : "ESTÉTICA", title: isEn ? "Body Hair Trim" : "Aparo de Pelos", desc: isEn ? "Body hair maintenance with clippers." : "Aparo dos pelos com máquina para higiene e estética, pente 0 e 3.", details: isEn ? "1. Trim with clippers." : "1. Aparo com máquina (pente zero ou três).\n2. Corpo limpo e estética agradável para a sessão." }
    ] as ServiceItem[],
    
    plans: [
      { id: 'pack_classic4', type: 'pack', title: isEn ? "Pain-Free Month (4x)" : "Mês Sem Dor (4x)", price: p.pack_classic4.v, fullPrice: p.pack_classic4.full, savings: p.pack_classic4.save, desc: isEn ? "Relief with zero intimate touches." : "Alívio muscular contínuo e zero toques íntimos. 1x por semana.", details: isEn ? "4x Classic Massage" : "4x Massagem Clássica\nAgendamento flexível 1x por semana.", tag: "CLÁSSICO", icon: "calendar" },
      { id: 'pack_tantric', type: 'pack', title: isEn ? "Tantric Journey (3x)" : "Jornada Tântrica (3x)", price: p.pack_tantric.v, fullPrice: p.pack_tantric.full, savings: p.pack_tantric.save, desc: isEn ? "Three encounters escalating intimacy." : "Três encontros escalando o nível de intimidade e relaxamento.", details: isEn ? "Sensory + Fusion + Nuru" : "1x Sensitiva (Despertar)\n1x Fusion (Pele a pele)\n1x Nuru (Deslize com gel e entrega total)", tag: "IMERSÃO", icon: "heart" },
    ] as ServiceItem[],

    extras: [
      { id: 'hair_trim', price: p.extras.hair_trim, icon: "scissors", label: isEn ? "Trim (Extra)" : "Aparo de Pelos (Até 2 áreas)", desc: "" },
      { id: 'more_time', price: p.extras.more_time, icon: "clock", label: isEn ? "Extended Time (+30m)" : "Sessão mais longa (+30 Minutos)", desc: "" },
      { id: 'aroma', price: p.extras.aroma, icon: "sparkles", label: isEn ? "Aromatherapy" : "Aromaterapia Relaxante", desc: "" }
    ],
    faq: [
      { q: isEn ? "Is there sex/penetration?" : "Rola sexo ou penetração (Programa)?", a: isEn ? "No. Strictly therapeutic with a manual ending." : "Não. Meu trabalho é estritamente focado no relaxamento e terapia tântrica. Nas sessões com finalização, o ápice do prazer é alcançado através de técnicas manuais (massagem no Lingam) com foco no seu alívio, de forma muito respeitosa e intensa. Não realizo penetração ou sexo ativo/passivo." },
      { q: isEn ? "Is it discreet?" : "Sou casado/sigiloso, o atendimento é discreto?", a: isEn ? "Absolute discretion guaranteed." : "Sim. A discrição é absoluta. O atendimento no seu local, hotel ou na minha suíte garante privacidade total. Ninguém além de nós saberá do encontro. Seus dados são apagados do meu histórico." },
      { q: isEn ? "Where is the meeting?" : "Onde nós vamos nos encontrar?", a: isEn ? "I come to you or a hotel." : "Eu vou até você (residência ou hotel) ou você pode vir na minha Suíte Privada na Bela Vista." },
      { q: isEn ? "Ashamed of my body?" : "Tenho vergonha do meu corpo, o que eu faço?", a: isEn ? "No judgments here." : "Esqueça isso. Meu ambiente é livre de preconceitos. Não importa sua idade ou formato de corpo. Estou focado exclusivamente em cuidar de você e entregar prazer e relaxamento." }
    ],
    rules: [
      { icon: "shield", title: isEn ? "Discretion & Sigil" : "Sigilo e Discrição Absoluta", description: isEn ? "Total privacy." : "Para o conforto de homens sigilosos ou casados, o que acontece na sessão morre na sessão." },
      { icon: "hand", title: isEn ? "Boundaries (No Sex)" : "Limites Claros (Sem Ato Sexual)", description: isEn ? "Manual release only." : "As sessões focadas em finalização utilizam apenas técnicas de estímulo manual. Sexo (penetração) não faz parte do serviço." },
      { icon: "shower", title: isEn ? "Hygiene" : "Higiene Básica", description: isEn ? "Shower before." : "Um banho quente antes do nosso contato é essencial para o conforto e respeito mútuo." }
    ],
    text: {
      welcome: isEn ? "Welcome," : "Olá,",
      welcome_anon: isEn ? "allow yourself." : "permita-se relaxar.",
      choose_sub: isEn ? "Choose your care." : "Espaço seguro, sigiloso e sem julgamentos para homens soltarem a tensão da rotina.",
      specialist: isEn ? "Tantric Specialist" : "Terapeuta Tântrico Corporal",
      level_label: isEn ? "Your Journey" : "Seu Nível",
      tab_packs: isEn ? "Plans" : "Combos Mensais",
      tab_single: isEn ? "Single" : "Sessões Avulsas",
      next_btn: isEn ? "Continue" : "Continuar",
      finish_btn: isEn ? "Complete Booking" : "Finalizar Agendamento",
      loading: isEn ? "Loading..." : "Preparando o seu ambiente...",
      toast_select_item: isEn ? "Add a service." : "Escolha ao menos um serviço.",
      toast_select_date: isEn ? "Choose date & time." : "Escolha o dia e horário.",
      toast_fill_name: isEn ? "Fill your name." : "Como devo te chamar?",
      toast_fill_addr: isEn ? "Fill the address." : "Preencha o local do encontro.",
      toast_accept_terms: isEn ? "Accept terms." : "Leia e aceite as regras.",
      toast_coupon_success: isEn ? "Gift applied!" : "Benefício ativado com sucesso!",
      toast_coupon_invalid: isEn ? "Invalid code." : "Código inválido ou expirado.",
      toast_cep_found: isEn ? "Address found." : "Endereço encontrado.",
      toast_cep_error: isEn ? "CEP not found." : "CEP não encontrado.",
      details_label: isEn ? "WHAT TO EXPECT:" : "O QUE ACONTECE NA SESSÃO:",
      select_time_title: isEn ? "When?" : "Quando vamos nos ver?",
      location_title: isEn ? "Where?" : "Onde será nosso encontro?",
      extras_title: isEn ? "Add-ons" : "Deseja algo a mais?",
      coupon_section: isEn ? "Gifts & Promos" : "Seus Benefícios e Cupons",
      coupon_empty: isEn ? "No gifts yet." : "Nenhum benefício ativo no momento.",
      payment_title: isEn ? "Payment (In person)" : "Forma de pagamento (No local)",
      terms_title: isEn ? "Rules & Discretion" : "Regras e Sigilo",
      success_title: isEn ? "Almost there!" : "Tudo Certo, falta pouco!",
      success_sub: isEn ? "Send the summary on WhatsApp to confirm." : "Para garantir seu horário e o sigilo, me envie o resumo no WhatsApp para confirmarmos tudo.",
      whatsapp_btn: isEn ? "Send to WhatsApp" : "Confirmar via WhatsApp",
      calendar_btn: isEn ? "Add to Calendar" : "Salvar na Agenda (Discreto)",
      back_home: isEn ? "Start over" : "Voltar para o início",
      timer_text: isEn ? "Cart saved for" : "Reserva segura por",
      input_name: isEn ? "Name or Nickname" : "Nome ou Apelido (Sigilo mantido)",
      input_cep: isEn ? "ZIP" : "CEP do local",
      input_addr: isEn ? "Street" : "Rua ou Avenida",
      input_num: isEn ? "Number" : "Número",
      input_district: isEn ? "District" : "Bairro",
      input_city: isEn ? "City" : "Cidade",
      input_comp: isEn ? "Apt (Opt)" : "Complemento (Opcional)",
      input_hotel: isEn ? "Hotel" : "Nome do Hotel",
      input_room: isEn ? "Room" : "Quarto / Suíte",
      agree_terms: isEn ? "I agree" : "Eu li e compreendi as regras",
      faq_title: isEn ? "FAQ" : "Dúvidas Frequentes",
      reviews_title: isEn ? "Experiences:" : "Relatos de quem já se permitiu:",
      empty_date: isEn ? "Select a day." : "Toque em um dia acima para ver os horários.",
      total_label: isEn ? "Total" : "Total",
      subtotal: isEn ? "Subtotal" : "Subtotal",
      pix_discount: isEn ? "Pix (3% OFF)" : "Pix (3% OFF)",
      rules_complete: isEn ? "Agreements" : "Nossos Acordos Inegociáveis",
      uber_notice: isEn ? "Travel fee confirmed on WhatsApp." : "Importante: A taxa de Uber até você será calculada no WhatsApp.",
      motel_note: isEn ? "Address sent after booking." : "Perfeito! Te envio o endereço da minha suíte (Bela Vista) no WhatsApp.",
      menu_title: isEn ? "Settings" : "Menu",
      level_yours: isEn ? "Your XP" : "Seu Progresso",
      level_current: isEn ? "Points" : "Pontos",
      level_journey: isEn ? "Journey" : "Jornada",
      theme_title: isEn ? "Theme" : "Aparência",
      theme_dark: isEn ? "Dark" : "Escuro",
      theme_light: isEn ? "Light" : "Claro",
      refer_btn: isEn ? "Share" : "Indicar de forma discreta",
      share_text: isEn ? 'Great massage therapist.' : 'Cara muito bom pra massagem e aliviar a tensão em SP. Super discreto.',
      header_tensions: isEn ? "sessions" : "atendimentos",
      step_when: isEn ? "When" : "Quando",
      step_where: isEn ? "Where" : "Onde",
      step_summary: isEn ? "Summary" : "Resumo",
      cart_title: isEn ? "Cart" : "Sua Seleção",
      time_rush: isEn ? "Rush" : "Pico",
      loc_home: isEn ? "Home" : "Na sua Casa",
      loc_motel: isEn ? "My Suite" : "Minha Suíte",
      loc_hotel: isEn ? "Hotel" : "Hotel",
      summary_title: isEn ? "Summary" : "Resumo da Sessão",
      summary_items: isEn ? "SERVICES" : "O QUE VAMOS FAZER",
      summary_extras: isEn ? "EXTRAS" : "ADICIONAIS",
      summary_info: isEn ? "DETAILS" : "INFORMAÇÕES",
      summary_loc_home: isEn ? "At home" : "Na sua residência",
      summary_loc_motel: isEn ? "At my suite" : "Na minha suíte",
      summary_loc_hotel: isEn ? "At hotel" : "Em um hotel",
      pay_pix: isEn ? "Pix (3% OFF)" : "Pix",
      pay_card: isEn ? "Card" : "Cartão (Crédito/Débito)",
      pay_cash: isEn ? "Cash" : "Dinheiro",
      terms_read: isEn ? "Read rules" : "Toque para ler as regras de convivência",
      level_redeem: isEn ? "Redeem" : "Resgatar XP",
      today: isEn ? "TODAY" : "HOJE",
      tomorrow: isEn ? "TOMORROW" : "AMANHÃ",
      popular_badge: isEn ? "Popular" : "A Mais Pedida",
      items_selected: isEn ? "items" : "selecionado(s)",
      btn_finish_short: isEn ? "Finish" : "Concluir",
      btn_next_short: isEn ? "Next" : "Próximo",
      msg_rush_fee: isEn ? "Rush Fee" : "Deslocamento / Pico",
      toast_loaded: isEn ? "Loaded" : "Dados carregados!",
      toast_cart_toggle: isEn ? "Updated." : "Serviço alterado.",
      toast_pix_copied: isEn ? "PIX copied" : "Chave PIX copiada!",
      morning: isEn ? "Morning" : "Manhã",
      afternoon: isEn ? "Afternoon" : "Tarde",
      evening: isEn ? "Evening" : "Noite",
      levelup_popup_title: isEn ? "Level Up!" : "Você subiu de nível!",
      levelup_popup_msg: isEn ? "New benefit unlocked." : "Seus pontos geraram uma nova recompensa tântrica. Aproveite seu benefício.",
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
      <div key={t.id} role="alert" className={`animate-toast-in pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-xl ${t.type === 'error' ? 'bg-red-950/90 border-red-500/50 text-red-100' : isDark ? 'bg-[#181c25]/95 border-zinc-700 text-white' : 'bg-white/95 border-slate-200 text-slate-800'} backdrop-blur-md`}>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${t.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-500'}`}>
          <Icon name={t.type === 'error' ? 'alert-circle' : 'check'} size={14} />
        </div>
        <span className="text-xs sm:text-sm font-bold leading-snug break-words flex-1">{t.msg}</span>
      </div>
    ))}
  </div>
));

const Button = memo(({ children, onClick, variant = 'primary', size = 'md', disabled = false, full = false, icon, className = '', loading = false }: any) => {
  const base = "relative inline-flex items-center justify-center font-bold tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] gap-2 shrink-0 overflow-hidden";
  const variants: Record<string, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-900/20",
    secondary: "bg-zinc-800 border border-zinc-700 text-white hover:bg-zinc-700",
    whatsapp: "bg-[#25D366] text-white hover:bg-[#22c55e] shadow-md shadow-green-900/20",
    outline: "border border-current text-current hover:bg-black/5",
    amber: "bg-amber-500 text-amber-950 hover:bg-amber-400 shadow-md shadow-amber-900/20",
  };
  const sizes: Record<string, string> = {
    sm: "min-h-[40px] py-2 px-4 text-xs rounded-xl",
    md: "min-h-[48px] py-3 px-6 text-sm rounded-xl",
    lg: "min-h-[52px] py-3 px-8 text-sm rounded-2xl",
  };
  return (
    <button type="button" onClick={onClick} disabled={disabled || loading}
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${full ? 'w-full' : ''} ${className}`}>
      {loading ? <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" /> : <>{icon && <Icon name={icon} size={20} className="shrink-0" />}<span className="break-words text-center">{children}</span></>}
    </button>
  );
});

const InputField = memo(({ label, value, onChange, placeholder, icon, type = 'text', isDark = true, hasError = false, disabled = false, maxLength, id }: any) => {
  const inputId = id || `input-${label?.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div className={`space-y-1.5 w-full ${hasError ? 'animate-shake' : ''}`}>
      {label && <label htmlFor={inputId} className={`block text-[10px] sm:text-xs font-bold uppercase tracking-widest pl-1 ${hasError ? 'text-red-400' : isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{label}</label>}
      <div className="relative group">
        {icon && <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${hasError ? 'text-red-400' : isDark ? 'text-zinc-500' : 'text-slate-400'}`}><Icon name={icon} size={20} /></div>}
        <input id={inputId} type={type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled} maxLength={maxLength}
          className={`input-field font-medium w-full min-h-[52px] rounded-xl text-sm transition-all border outline-none disabled:opacity-50 ${icon ? 'pl-12 pr-4' : 'px-4'} ${hasError ? 'border-red-500/50 bg-red-950/10 text-red-400' : isDark ? 'border-zinc-700 bg-white/5 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:bg-white/10' : 'border-slate-300 bg-slate-50 text-slate-900 focus:border-blue-500'}`} />
      </div>
    </div>
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
      setTimeout(() => setShowMsg(false), 5000); 
    }, 15000); 
    setTimeout(() => setShowMsg(true), 3000);
    return () => clearInterval(interval);
  }, []);

  const msg = lang === 'en' ? 'Hi! Need any help?' : 'Oi, tem alguma dúvida?';

  return (
    <div className="fixed bottom-24 right-4 sm:bottom-24 sm:right-6 z-50 flex items-center gap-4 pointer-events-none">
      <div className={`pointer-events-auto transition-all duration-500 origin-right ${showMsg ? 'scale-100 opacity-100 translate-x-0' : 'scale-90 opacity-0 translate-x-4 pointer-events-none'}`}>
        <div className={`px-4 py-3 rounded-2xl shadow-xl relative cursor-pointer border max-w-[220px] flex items-center ${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-slate-200'}`} onClick={onClick}>
          <p className={`text-sm font-bold leading-snug ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{msg}</p>
          <div className={`absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 rotate-45 border-t border-r ${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-slate-200'}`} />
        </div>
      </div>
      <button onClick={onClick} className="pointer-events-auto relative shrink-0 hover:scale-105 transition-transform" aria-label="Contato WhatsApp">
        <div className={`w-14 h-14 rounded-full overflow-hidden border-[3px] shadow-[0_4px_20px_rgba(37,211,102,0.4)] border-[#25D366]`}>
          <img src="https://i.ibb.co/gZxp3Dwz/Screenshot-1.png" alt="Contato" className="w-full h-full object-cover" />
        </div>
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
  { val: 5, color: '#f59e0b' },
  { val: 10, color: '#2563eb' },
  { val: 5, color: '#f59e0b' },
  { val: 15, color: '#10b981' },
  { val: 5, color: '#f59e0b' },
  { val: 10, color: '#2563eb' },
  { val: 5, color: '#f59e0b' },
  { val: 20, color: '#e11d48' },
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
      <div role="dialog" className={`relative w-full max-w-sm rounded-[2rem] p-6 text-center border shadow-2xl animate-scale-in flex flex-col items-center ${isDark ? 'bg-[#181c25] border-amber-900/50 shadow-[0_0_50px_rgba(245,158,11,0.15)]' : 'bg-white border-amber-200'}`}>
        <button onClick={onClose} className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center z-50 ${isDark ? 'bg-zinc-800 text-zinc-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-800'}`}>
          <Icon name="x" size={18} />
        </button>

        <h3 className={`font-display text-2xl mb-1 mt-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{lang === 'en' ? 'Spin & Win!' : 'Sorteie seu Desconto'}</h3>
        <p className={`text-xs font-bold mb-8 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{lang === 'en' ? 'Your welcome gift awaits.' : 'Um presente de boas vindas pra você.'}</p>

        <div className="relative w-64 h-64 mb-8">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 w-8 h-8 flex items-center justify-center drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
            <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8 text-white drop-shadow-xl z-20"><path d="M12 22L2 2h20L12 22z" /></svg>
          </div>
          
          <div className="w-full h-full rounded-full overflow-hidden border-[8px] border-[#11141a] shadow-inner relative"
            style={{ 
              transition: 'transform 5s cubic-bezier(0.2, 0.8, 0.2, 1)', transform: `rotate(${rotation}deg)`,
              background: `conic-gradient(from -22.5deg, #f59e0b 0 45deg, #2563eb 45deg 90deg, #f59e0b 90deg 135deg, #10b981 135deg 180deg, #f59e0b 180deg 225deg, #2563eb 225deg 270deg, #f59e0b 270deg 315deg, #e11d48 315deg 360deg)`
            }}>
            {PRIZES.map((p, i) => (
              <div key={i} className="absolute inset-0 origin-center" style={{ transform: `rotate(${i * 45}deg)` }}>
                <div className="absolute top-3 left-1/2 -translate-x-1/2 text-white font-bold font-display text-lg drop-shadow-md">{p.val}</div>
                <div className="absolute top-0 left-1/2 w-0.5 h-1/2 bg-white/20 origin-bottom" style={{ transform: 'translateX(-50%) rotate(22.5deg)' }} />
              </div>
            ))}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#11141a] border-4 border-amber-500 flex items-center justify-center shadow-lg z-10"><Icon name="star" size={16} className="text-amber-500 fill-amber-500" /></div>
          </div>
        </div>

        {phase === 'idle' && <Button full size="lg" variant="amber" onClick={spinWheel} className="animate-pulse-slow">{lang === 'en' ? 'SPIN ROULETTE' : 'GIRAR ROLETA'}</Button>}
        {phase === 'spinning' && <Button full size="lg" disabled variant="secondary" className="opacity-50">{lang === 'en' ? 'Spinning...' : 'Sorteando...'}</Button>}
        {phase === 'won' && (
          <div className="animate-fade-up w-full">
            <p className={`font-display text-2xl mb-4 text-amber-500`}>{lang === 'en' ? 'You Won R$' : 'Você Ganhou R$'} {winValue} OFF!</p>
            <Button full size="lg" variant="amber" onClick={() => onWin(winValue)}>{lang === 'en' ? 'Claim My Discount' : 'Pegar Meu Desconto'}</Button>
          </div>
        )}
      </div>
    </div>
  );
});

const SideMenu = memo(({ isOpen, onClose, isDark, toggleTheme, user, T }: any) => {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] animate-fade-in" onClick={onClose} />
      <aside role="dialog" className={`fixed top-0 right-0 h-full w-[85vw] max-w-[320px] z-[70] p-5 sm:p-6 shadow-2xl animate-slide-right flex flex-col ${isDark ? 'bg-[#11141a] border-l border-white/10' : 'bg-[#f9f8f6] border-l border-slate-200'}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display text-xl">{T.menu_title}</h2>
          <button onClick={onClose} className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${isDark ? 'hover:bg-white/10 text-zinc-400' : 'hover:bg-slate-200 text-slate-500'}`}><Icon name="x" size={20} /></button>
        </div>
        <div className={`mb-6 p-5 rounded-2xl border relative overflow-hidden ${isDark ? 'bg-blue-950/20 border-blue-900/50' : 'bg-blue-50 border-blue-200'}`}>
          <p className={`text-[10px] uppercase font-bold tracking-widest mb-1 ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>{T.level_yours}</p>
          <div className="flex items-baseline gap-1.5"><span className="font-display text-3xl">{user.xp}</span><span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>XP</span></div>
        </div>
        <nav className="flex-1 space-y-3">
          <button onClick={toggleTheme} className={`w-full min-h-[52px] flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${isDark ? 'hover:bg-white/5 text-zinc-200' : 'hover:bg-slate-100 text-slate-800'}`}>
            <div className="flex items-center gap-3"><Icon name={isDark ? "moon" : "sun"} size={18} className={isDark ? "text-blue-400" : "text-blue-600"} /><span className="text-sm font-bold">{T.theme_title}</span></div>
            <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>{isDark ? T.theme_dark : T.theme_light}</span>
          </button>
          <button onClick={() => { if (navigator.share) navigator.share({ title: 'Thalyson', text: T.share_text, url: window.location.href }); }} className={`w-full min-h-[52px] flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isDark ? 'hover:bg-white/5 text-zinc-200' : 'hover:bg-slate-100 text-slate-800'}`}>
            <Icon name="share" size={18} className="text-emerald-500" /><span className="text-sm font-bold">{T.refer_btn}</span>
          </button>
        </nav>
      </aside>
    </>
  );
});

const ReviewCard = memo(({ review, isDark }: { review: Review; isDark: boolean }) => (
  <article className={`h-full flex flex-col p-5 rounded-3xl border transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
    <div className="flex items-start justify-between mb-4 gap-3">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-display text-sm font-bold shrink-0 ${isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>{review.n.charAt(0)}</div>
        <div className="min-w-0 flex-1">
          <h3 className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{review.n}</h3>
          <span className={`text-xs font-medium truncate block ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{review.loc}</span>
        </div>
      </div>
      <div className="flex gap-0.5 shrink-0">{[...Array(5)].map((_, i) => <Icon key={i} name="star" size={12} className={i < review.s ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'} />)}</div>
    </div>
    <div className={`inline-flex self-start items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3 border truncate ${isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
      <Icon name="award" size={10} /> {review.serv}
    </div>
    <p className={`text-sm leading-relaxed font-medium italic flex-1 break-words-all ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>"{review.t}"</p>
  </article>
));

const FAQItem = memo(({ q, a, isDark }: { q: string; a: string; isDark: boolean }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border-b last:border-b-0 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
      <button onClick={() => setOpen(!open)} className="w-full py-5 flex items-center justify-between text-left gap-4">
        <h3 className={`text-sm font-bold flex-1 ${isDark ? 'text-zinc-200' : 'text-slate-900'}`}>{q}</h3>
        <div className={`shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''} ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}><Icon name="chevron-down" size={18} /></div>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-[500px] pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className={`text-sm leading-relaxed font-medium ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>{a}</p>
      </div>
    </div>
  );
});

const SmartTimer = memo(({ isDark, text }: any) => {
  const [time, setTime] = useState(600);
  useEffect(() => { const i = setInterval(() => setTime(p => p <= 0 ? 600 : p - 1), 1000); return () => clearInterval(i); }, []);
  const fmt = (t: number) => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
  return (
    <div className={`flex items-center gap-4 p-4 rounded-3xl border w-full ${isDark ? 'bg-blue-950/20 border-blue-900/40' : 'bg-blue-50 border-blue-200'}`}>
      <Icon name="clock" size={24} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
      <div className="min-w-0 flex-1">
        <p className={`text-[10px] font-bold uppercase tracking-widest truncate ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>{text}</p>
        <p className={`font-display text-xl whitespace-nowrap ${isDark ? 'text-white' : 'text-slate-900'}`}>{fmt(time)}</p>
      </div>
    </div>
  );
});

const RuleItem = memo(({ rule, isDark }: { rule: Rule; isDark: boolean }) => (
  <article className={`flex items-start gap-4 p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
    <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-slate-200 text-slate-700'}`}><Icon name={rule.icon} size={20} /></div>
    <div className="min-w-0 flex-1">
      <h4 className={`text-sm font-bold mb-1 font-display break-words ${isDark ? 'text-white' : 'text-slate-900'}`}>{rule.title}</h4>
      <p className={`text-xs sm:text-sm font-medium break-words ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{rule.description}</p>
    </div>
  </article>
));

const ServiceModal = memo(({ service, isOpen, onClose, onSelect, isInCart, isDark, T, lang, isPack }: any) => {
  if (!isOpen || !service) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div role="dialog" className={`relative w-full max-w-md max-h-[85vh] flex flex-col rounded-3xl border shadow-2xl animate-scale-in overflow-hidden ${isDark ? 'bg-[#181c25] border-zinc-700' : 'bg-white border-slate-200'}`}>
        <div className={`relative p-5 pb-4 shrink-0 border-b ${isDark ? 'border-zinc-800' : 'border-slate-100'} ${isPack ? (isDark ? 'bg-amber-950/20' : 'bg-amber-50/50') : ''}`}>
          <button onClick={onClose} className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-500'}`}><Icon name="x" size={18} /></button>
          <div className="flex items-center gap-3 mb-3 pr-10">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${isPack ? isDark ? 'bg-amber-900/30 border-amber-800 text-amber-500' : 'bg-amber-100 border-amber-200 text-amber-700' : isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
              <Icon name={service.icon} size={20} />
            </div>
            <div className="flex-1 min-w-0">
               <div className="flex items-center gap-2 flex-wrap mb-0.5">
                 <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border ${isPack ? isDark ? 'border-amber-800/50 text-amber-500' : 'border-amber-300 text-amber-800' : isDark ? 'border-zinc-700 text-zinc-400' : 'border-slate-300 text-slate-600'}`}>{service.tag}</span>
                 {service.popular && <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-blue-600 text-white">{T.popular_badge}</span>}
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
          <p className="text-sm font-medium">{service.desc}</p>
          <div>
            <h4 className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{T.details_label}</h4>
            <div className="space-y-3">
              {service.details.split('\n').map((line: string, i: number) => (
                <div key={i} className="flex items-start gap-3 text-sm font-medium">
                  <div className={`mt-0.5 shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${isPack ? isDark ? 'bg-amber-500/20 text-amber-500' : 'bg-amber-100 text-amber-700' : isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'}`}><Icon name="check" size={10} /></div>
                  <span className="leading-relaxed flex-1" dangerouslySetInnerHTML={{__html: line.replace(/^\d+\.\s*/, '').replace(/\*(.*?)\*/g, '<strong class="text-amber-500">$1</strong>')}}></span>
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
    <button className={`relative w-full text-left rounded-2xl border transition-all card-hover flex flex-col h-auto min-h-[120px] ${isInCart ? isPack ? 'service-card-selected-amber border-amber-500/50 bg-amber-500/10' : 'service-card-selected border-blue-500/50 bg-blue-500/5' : isDark ? 'bg-[#181c25] border-zinc-700 hover:border-zinc-600' : 'bg-white border-slate-200 shadow-sm hover:border-slate-300'}`} onClick={() => onOpenModal(service)}>
      {isInCart && <div className={`absolute top-3 right-3 z-10 w-6 h-6 rounded-full flex items-center justify-center animate-scale-in shrink-0 ${isPack ? 'bg-amber-500 text-amber-950' : 'bg-blue-600 text-white'}`}><Icon name="check" size={14} /></div>}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${isPack ? isDark ? 'bg-amber-900/30 border-amber-800/50 text-amber-500' : 'bg-amber-50 border-amber-200 text-amber-600' : isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
            <Icon name={service.icon} size={20} />
          </div>
          <div className="flex-1 min-w-0 pr-6">
            <h3 className={`text-base font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{service.title}</h3>
            <p className={`text-xs mt-1 font-medium line-clamp-2 ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{service.desc}</p>
          </div>
        </div>
        <div className="flex items-end justify-between mt-auto gap-2">
          <div className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border truncate max-w-[50%] ${isPack ? isDark ? 'border-amber-800/50 text-amber-500' : 'border-amber-300 text-amber-700' : isDark ? 'border-zinc-700 text-zinc-400' : 'border-slate-300 text-slate-700'}`}>{service.tag}</div>
          <div className="text-right shrink-0">
            {service.fullPrice && <p className={`text-[10px] font-bold line-through mb-0.5 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{formatMoney(service.fullPrice, lang)}</p>}
            <p className={`font-display text-lg leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatMoney(service.price, lang)}</p>
          </div>
        </div>
      </div>
    </button>
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
    name: '', xp: 0, coupons: [], usedCoupons: [], hasSeenWelcome: false, ordersCount: 142, lastActivity: new Date().toISOString()
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

  const downloadICS = () => {
    if(!booking.date || !booking.time) return;
    const d = new Date(booking.date);
    const [h, m] = booking.time.split(':');
    d.setHours(parseInt(h), parseInt(m), 0, 0);
    const endD = new Date(d.getTime() + (120 * 60000)); // 2h placeholder

    const fmt = (date: Date) => {
        return date.toISOString().replace(/-|:|\.\d+/g, '').substring(0,15) + 'Z';
    };

    const icsData = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Thalyson Massagens//PT',
        'BEGIN:VEVENT',
        `DTSTART:${fmt(d)}`,
        `DTEND:${fmt(endD)}`,
        `SUMMARY:Sessão de Relaxamento`,
        `DESCRIPTION:Seu momento reservado de descanso e cuidado sigiloso.`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\n');
    
    const blob = new Blob([icsData], { type: 'text/calendar' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sessao-relaxamento.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast("Evento discreto salvo na agenda!");
  };

  useEffect(() => { setIsClient(true); cleanupStorage(); }, []);

  useEffect(() => {
    if (!isClient) return;
    let loadedUser = { ...user };
    let loadedBooking = { ...booking };
    let loadedStep = 0;
    try {
      const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.user) loadedUser = { ...loadedUser, ...parsed.user };
        if (parsed.bookingDraft) loadedBooking = { ...loadedBooking, ...parsed.bookingDraft };
        if (typeof parsed.step === 'number' && parsed.step >= 0 && parsed.step <= 4) loadedStep = parsed.step;
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
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(save));
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
  }, [loading, isClient, dataLoaded, user.hasSeenWelcome]);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [step]);

  const handleToggleCartItem = useCallback((item: ServiceItem) => {
    vibrate(50);
    setBooking(prev => {
      const exists = prev.cart.find(c => c.id === item.id);
      return { ...prev, cart: exists ? prev.cart.filter(c => c.id !== item.id) : [...prev.cart, item], payment: '', termsAccepted: false };
    });
    addToast(T.toast_cart_toggle);
  }, [addToast, T]);

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskCEP(e.target.value);
    setBooking(b => ({ ...b, address: { ...b.address, cep: masked } }));
    if (masked.length === 9) {
      setIsFetchingCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${masked.replace('-', '')}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setBooking(b => ({ ...b, address: { ...b.address, cep: masked, street: data.logradouro || b.address.street, district: data.bairro || b.address.district, city: data.localidade || b.address.city } }));
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
    if (sel.toDateString() === now.toDateString()) return slots.filter(t => parseInt(t) > now.getHours());
    return slots;
  }, [booking.date]);

  const groupedTimeSlots = useMemo(() => {
    return {
      morning: generateTimeSlots.filter(t => parseInt(t) >= 8 && parseInt(t) < 12),
      afternoon: generateTimeSlots.filter(t => parseInt(t) >= 12 && parseInt(t) < 17),
      evening: generateTimeSlots.filter(t => parseInt(t) >= 17 && parseInt(t) <= 22)
    };
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

    if ((booking.customExtraText || '').trim().length > 0) sub += 150;

    const duration = baseDuration + addedTime;
    const isRush = RUSH_HOURS.includes(booking.time || '');
    const rushFee = (isRush && booking.locationType !== 'motel') ? RUSH_FEE : 0;
    const disc = booking.appliedCoupon ? (booking.appliedCoupon.code === 'MIND&BODY' ? sub * 0.10 : booking.appliedCoupon.val) : 0;
    let running = Math.max(0, sub - disc);
    let pixDisc = booking.payment === 'pix' ? Math.ceil(running * 0.03) : 0;
    return { sub, disc, pixDisc, rushFee, total: Math.max(0, running - pixDisc) + rushFee, duration };
  }, [booking, DATA.extras]);

  const estimatedXP = useMemo(() => Math.floor(financials.total * (booking.cart.some(i => i.type === 'pack') ? 0.30 : 0.15)), [financials.total, booking.cart]);

  const isStepValid = useCallback(() => {
    if (step === 0) return booking.cart.length > 0;
    if (step === 1) {
      if (!user.name || String(user.name).trim().length < 2) return false;
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
      const msgs: Record<number, string> = { 0: T.toast_select_item, 1: !user.name || String(user.name).trim().length < 2 ? T.toast_fill_name : T.toast_fill_addr, 2: T.toast_select_date, 3: T.toast_accept_terms };
      addToast(msgs[step] || '', 'error');
      return;
    }
    vibrate(30);
    if (step === 3) finishBooking(); else setStep(s => s + 1);
  }, [step, booking, user.name, T, addToast, isStepValid]);

  const applyManualCoupon = () => {
    const code = manualCoupon.trim().toUpperCase();
    if (code === 'MIND&BODY') {
      setBooking(b => ({ ...b, appliedCoupon: { id: 'manual', val: 0, title: '10% OFF (MIND&BODY)', code: 'MIND&BODY' } }));
      addToast(T.toast_coupon_success);
      setManualCoupon('');
    } else {
      addToast(T.toast_coupon_invalid, 'error');
    }
  };

  const generateWhatsAppMsg = () => {
    const f = financials;
    const dateStr = booking.date ? new Date(booking.date).toLocaleDateString(lang === 'en' ? CONFIG.LOCALE_EN : CONFIG.LOCALE_PT) : '';
    const hash = btoa(encodeURIComponent(`${f.total}-${dateStr}-${CONFIG.SECRET_TOKEN}`)).substring(0, 6).toUpperCase();
    
    const servicesText = booking.cart.map(item => `▪️ *${item.title}*\n_${item.desc}_`).join('\n\n');
    let locTxt = '';
    if (booking.locationType === 'home') locTxt = `🏡 *Residência*\n  ${booking.address.street}, ${booking.address.number} - ${booking.address.district}, ${booking.address.city}\n  ${booking.address.comp ? `Det: ${booking.address.comp}` : ''}`.trim(); 
    else if (booking.locationType === 'motel') locTxt = `🔑 *Minha Suíte*\n  (Endereço enviado após confirmação)`;
    else locTxt = `🏨 *Hotel: ${booking.address.placeName}*\n  Cidade: ${booking.address.city}\n  Quarto: ${booking.address.comp || '-'}`; 
    
    const extrasArr = Object.keys(booking.extras || {}).filter(k => booking.extras[k]).map(k => { 
      const ex = DATA.extras.find((e: any) => e.id === k); return ex ? `  ➕ ${ex.label}` : ''; 
    });
    if ((booking.customExtraText || '').trim().length > 0) extrasArr.push(`  ➕ Pedido Especial: ${booking.customExtraText.trim()} (+R$ 150,00)`);
    const extrasList = extrasArr.filter(Boolean).join('\n');
    
    let prices = `*Subtotal:* ${formatMoney(f.sub, lang)}`;
    if (f.disc > 0) prices += `\n*Benefício:* -${formatMoney(f.disc, lang)}`;
    if (f.pixDisc > 0) prices += `\n*PIX (3% OFF):* -${formatMoney(f.pixDisc, lang)}`;
    if (f.rushFee > 0) prices += `\n*Taxa Pico/Deslocamento:* +${formatMoney(f.rushFee, lang)}`;
    prices += `\n\n💰 *INVESTIMENTO TOTAL: ${formatMoney(f.total, lang)}*`;
    
    return `*PEDIDO DE SESSÃO* | #${hash}\n──────────────────\nOlá Thalyson. Estou precisando de alívio e me desconectar.\n\n👤 *Meu nome/apelido:* ${sanitizeInput(user.name)}\n📅 *Quando:* ${dateStr} às ${booking.time}\n⏳ *Tempo reservado:* ~${f.duration} min\n\n*A EXPERIÊNCIA:*\n${servicesText}\n\n${extrasList ? `*Complementos:*\n${extrasList}\n\n` : ''}*ONDE VAI SER:*\n${locTxt}\n\n*Saúde:* Declaro estar saudável.\n\n*VALORES:*\n${prices}\n*Pagamento:* ${booking.payment.toUpperCase()}\n──────────────────\n_Estou ciente e aceito os acordos de sigilo, higiene e limites (sem ato sexual)._`;
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
        updatedCoupons.push({ id: `LVL${lvl.level}_${Date.now()}`, val: lvl.reward, title: `${lvl.title} Bônus`, code: `LVLUP${lvl.level}` });
      }
    });

    setUser(p => ({ ...p, xp: newXP, coupons: updatedCoupons, usedCoupons: updatedHistory, ordersCount: (p.ordersCount || 142) + 1, lastActivity: new Date().toISOString() }));
    if (leveledUp) { setLevelUpPopup(true); setTimeout(() => addToast(T.levelup_popup_title, 'success'), 500); }
    setStep(4);
  };

  const categoryConfig = [
    { id: 'relax', title: lang === 'en' ? "Therapeutic" : "Massagem Terapêutica", icon: 'sun', desc: lang === 'en' ? "Pain relief without intimate touches." : "Foco em dores, sem toques íntimos." },
    { id: 'final', title: lang === 'en' ? "Tantric Journey" : "Terapia Tântrica & Prazer", icon: 'sparkles', desc: lang === 'en' ? "Sensory focus with manual release." : "Jornada sensorial com finalização íntima manual." },
    { id: 'care', title: lang === 'en' ? "Aesthetics" : "Cuidados Masculinos", icon: 'scissors', desc: lang === 'en' ? "Body hair trim." : "Aparo de pelos corporais." },
  ];

  if (!isClient) return <div className="min-h-screen w-full bg-[#11141a]" />;

  if (loading) {
    return (
      <div className={`fixed inset-0 flex flex-col items-center justify-center z-[100] ${isDark ? 'bg-[#11141a]' : 'bg-[#f9f8f6]'}`}>
        <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center animate-pulse"><span className="text-white font-display text-4xl">T</span></div>
      </div>
    );
  }

  return (
    <>
      <GlobalStyles isDark={isDark} />
      <ToastContainer toasts={toasts} isDark={isDark} />
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} isDark={isDark} toggleTheme={() => setIsDark(p => !p)} user={user} T={T} />
      
      <ServiceModal service={selectedServiceForModal} isOpen={!!selectedServiceForModal} onClose={() => setSelectedServiceForModal(null)} onSelect={handleToggleCartItem} isInCart={selectedServiceForModal ? booking.cart.some(c => c.id === selectedServiceForModal.id) : false} isDark={isDark} T={T} lang={lang} isPack={selectedServiceForModal?.type === 'pack'} />

      <TigrinhoRoulette
        isOpen={showRoulette} isDark={isDark} lang={lang} onClose={() => setShowRoulette(false)}
        onWin={(val: number) => {
          setShowRoulette(false);
          const c: Coupon = { id: `roleta_${Date.now()}`, val, title: lang === 'en' ? `Lucky Spin (R$ ${val})` : `Bônus Roleta (R$ ${val})`, code: `ROLETA${val}` };
          setUser(u => ({ ...u, hasSeenWelcome: true, coupons: [...u.coupons, c] }));
          setBooking(b => ({ ...b, appliedCoupon: c }));
          addToast(lang === 'en' ? `R$ ${val} gift added!` : `Presente de R$ ${val} adicionado!`, 'success');
        }}
      />

      <FloatingWhatsApp isDark={isDark} lang={lang} onClick={() => openExternal('whatsapp', 'Olá, estava no site e gostaria de tirar uma dúvida.')} />

      <main className={`min-h-screen relative z-10 pb-40 px-4 sm:px-6 max-w-3xl mx-auto overflow-x-hidden`}>

        {step !== 4 && (
          <header className="pt-6 pb-6 sm:pt-10 sm:pb-8">
            <div className="flex items-center justify-between gap-4">
              <button onClick={() => setStep(0)} className="group text-left">
                <h1 className={`font-display text-2xl sm:text-3xl font-bold leading-tight mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Thalyson Massagens</h1>
                <div className={`flex items-center gap-2 text-[10px] uppercase font-bold ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}><span className="relative flex h-2 w-2 shrink-0"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" /></span> Sigilo e Discrição ({user.ordersCount} {T.header_tensions})</div>
              </button>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => setLang(l => l === 'pt' ? 'en' : 'pt')} className={`h-10 w-10 flex items-center justify-center rounded-xl border ${isDark ? 'border-zinc-800 bg-zinc-900 text-zinc-400' : 'border-slate-200 bg-white text-slate-500'}`}><Icon name="globe" size={18} /></button>
                <button onClick={() => openExternal('instagram')} className={`h-10 w-10 flex items-center justify-center rounded-xl border ${isDark ? 'border-zinc-800 bg-zinc-900 text-pink-500' : 'border-slate-200 bg-white text-pink-600'}`}><Icon name="instagram" size={18} /></button>
                <button onClick={() => setMenuOpen(true)} className={`h-10 w-10 flex items-center justify-center rounded-xl border ${isDark ? 'border-zinc-800 bg-zinc-900 text-zinc-400' : 'border-slate-200 bg-white text-slate-500'}`}><Icon name="menu" size={18} /></button>
              </div>
            </div>
            {step > 0 && step < 4 && (
              <nav className="mt-6 flex items-center gap-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 cursor-pointer" onClick={() => { if (i < step) setStep(i); }}>
                    <div className={`w-full h-1.5 rounded-full ${step >= i ? 'bg-blue-600' : isDark ? 'bg-zinc-800' : 'bg-slate-200'}`} />
                  </div>
                ))}
              </nav>
            )}
          </header>
        )}

        <div>
          {/* STEP 0 */}
          {step === 0 && (
            <section className="animate-fade-up space-y-8">
              <div className="flex flex-col gap-6">
                <h2 className={`font-display font-bold text-2xl sm:text-3xl ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.welcome} <span className="text-blue-500">{user.name ? String(user.name).trim().split(' ')[0] : T.welcome_anon}</span></h2>
                
                <article className={`p-5 rounded-3xl border flex items-center gap-4 ${isDark ? 'bg-[#181c25] border-zinc-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <div className={`w-16 h-16 rounded-2xl overflow-hidden border p-0.5 ${isDark ? 'border-blue-900' : 'border-blue-200'}`}><img src="https://i.ibb.co/gZxp3Dwz/Screenshot-1.png" alt="Thalyson" className="w-full h-full object-cover rounded-xl" /></div>
                  <div className="flex-1">
                    <h3 className={`font-display font-bold text-lg mb-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>Thalyson</h3>
                    <p className={`text-[10px] font-bold uppercase ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{T.specialist}</p>
                    <p className={`text-xs font-medium mt-1 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>{T.choose_sub}</p>
                  </div>
                </article>

                {/* HORÁRIOS DE ATENDIMENTO */}
                <div className={`flex items-center gap-4 p-4 rounded-2xl border ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                    <Icon name="clock" size={20} />
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{lang === 'en' ? 'Working Hours' : 'Horários de Atendimento'}</p>
                    <p className={`text-xs font-medium mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{lang === 'en' ? 'Everyday from 09:00 AM to 10:00 PM' : 'Todos os dias, das 09:00 às 22:00'}</p>
                  </div>
                </div>
              </div>

              {/* DÚVIDAS FREQUENTES NO TOPO */}
              <section className="pb-2">
                <h2 className={`font-display font-bold text-2xl text-center mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.faq_title}</h2>
                <div className={`rounded-3xl border overflow-hidden ${isDark ? 'bg-[#181c25] border-zinc-800' : 'bg-white border-slate-200'}`}>
                  <div className={`px-5 divide-y ${isDark ? 'divide-zinc-800' : 'divide-slate-100'}`}>
                    {DATA.faq.map((item: any, idx: number) => <FAQItem key={idx} q={item.q} a={item.a} isDark={isDark} />)}
                  </div>
                </div>
              </section>

              <nav className={`flex p-1.5 rounded-2xl border w-full sm:w-fit mx-auto ${isDark ? 'bg-[#181c25] border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                {[{ id: 'single', label: T.tab_single, icon: 'user' }, { id: 'packs', label: T.tab_packs, icon: 'package' }].map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase transition-all min-h-[44px] ${activeTab === tab.id ? tab.id === 'packs' ? 'bg-amber-500 text-amber-950' : 'bg-blue-600 text-white' : isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                    <Icon name={tab.icon} size={16} /> {tab.label}
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
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${cfg.color}15`, border: `1px solid ${cfg.color}30` }}><Icon name={cat.icon} size={20} style={{ color: cfg.color }} /></div>
                            <div>
                              <h2 className={`font-display font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>{cat.title}</h2>
                              <p className={`text-xs font-medium ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{cat.desc}</p>
                            </div>
                          </div>
                          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {services.map((s: ServiceItem) => <ServiceCard key={s.id} service={s} isInCart={booking.cart.some(c => c.id === s.id)} onToggle={handleToggleCartItem} isDark={isDark} T={T} lang={lang} onOpenModal={setSelectedServiceForModal} />)}
                          </div>
                        </section>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {DATA.plans.map((s: ServiceItem) => <ServiceCard key={s.id} service={s} isInCart={booking.cart.some(c => c.id === s.id)} onToggle={handleToggleCartItem} isDark={isDark} T={T} lang={lang} isPack={true} onOpenModal={setSelectedServiceForModal} />)}
                  </div>
                )}
              </div>

              {/* RESTAURAÇÃO DOS FEEDBACKS / REVIEWS */}
              <section className={`py-10 border-t border-b ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`font-display font-bold text-2xl ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.reviews_title}</h2>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => reviewScrollRef.current?.scrollBy({ left: -260, behavior: 'smooth' })} className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${isDark ? 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-white' : 'border-slate-200 bg-white text-slate-500 hover:text-slate-800 shadow-sm'}`}><Icon name="chevron-left" size={18} /></button>
                    <button onClick={() => reviewScrollRef.current?.scrollBy({ left: 260, behavior: 'smooth' })} className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${isDark ? 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-white' : 'border-slate-200 bg-white text-slate-500 hover:text-slate-800 shadow-sm'}`}><Icon name="chevron-right" size={18} /></button>
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

            </section>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <section className="animate-fade-up max-w-xl mx-auto space-y-8">
              <header className="text-center"><h2 className={`font-display font-bold text-3xl mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.location_title}</h2></header>
              <div className="grid grid-cols-3 gap-3">
                {[{ id: 'home', label: T.loc_home, icon: 'home' }, { id: 'motel', label: T.loc_motel, icon: 'bed' }, { id: 'hotel', label: T.loc_hotel, icon: 'building' }].map(x => (
                  <button key={x.id} onClick={() => setBooking(b => ({ ...b, locationType: x.id as any }))}
                    className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all border min-h-[96px] ${booking.locationType === x.id ? 'bg-blue-600 border-blue-500 text-white shadow-md' : isDark ? 'bg-[#181c25] border-zinc-800 text-zinc-400' : 'bg-white border-slate-200 text-slate-600'}`}>
                    <Icon name={x.icon} size={24} /><span className="text-[10px] font-bold uppercase text-center">{x.label}</span>
                  </button>
                ))}
              </div>
              <article className={`p-5 sm:p-8 rounded-3xl border space-y-6 ${isDark ? 'bg-[#181c25] border-zinc-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <InputField isDark={isDark} label={T.input_name} value={user.name} onChange={(e: any) => setUser(u => ({ ...u, name: sanitizeInput(e.target.value) }))} icon="user" placeholder="Como quer ser chamado?" hasError={hasErrorGlobal && (!user.name || String(user.name).trim().length < 2)} />
                {booking.locationType === 'home' && (
                  <div className="space-y-5 animate-fade-up">
                    <InputField isDark={isDark} label={T.input_cep} value={booking.address.cep || ''} onChange={handleCepChange} icon="map-pin" placeholder="00000-000" type="tel" maxLength={9} disabled={isFetchingCep} hasError={hasErrorGlobal && !booking.address.street} />
                    <InputField isDark={isDark} label={T.input_addr} value={booking.address.street} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, street: sanitizeInput(e.target.value) } }))} placeholder="Rua / Avenida" disabled={isFetchingCep} hasError={hasErrorGlobal && !booking.address.street} />
                    <InputField isDark={isDark} label={T.input_num} value={booking.address.number} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, number: sanitizeInput(e.target.value) } }))} placeholder="Número" type="tel" hasError={hasErrorGlobal && !booking.address.number} />
                    <InputField isDark={isDark} label={T.input_district} value={booking.address.district} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, district: sanitizeInput(e.target.value) } }))} placeholder="Bairro" disabled={isFetchingCep} hasError={hasErrorGlobal && !booking.address.district} />
                    <InputField isDark={isDark} label={T.input_city} value={booking.address.city} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, city: sanitizeInput(e.target.value) } }))} placeholder="Cidade" disabled={isFetchingCep} hasError={hasErrorGlobal && !booking.address.city} />
                    <InputField isDark={isDark} label={T.input_comp} value={booking.address.comp} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, comp: sanitizeInput(e.target.value) } }))} placeholder="Complemento (Opcional)" />
                  </div>
                )}
                {booking.locationType === 'hotel' && (
                  <div className="space-y-5 animate-fade-up">
                    <InputField isDark={isDark} label={T.input_hotel} value={booking.address.placeName} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, placeName: sanitizeInput(e.target.value) } }))} icon="building" placeholder="Nome do Hotel" hasError={hasErrorGlobal && !booking.address.placeName} />
                    <InputField isDark={isDark} label={T.input_city} value={booking.address.city} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, city: sanitizeInput(e.target.value) } }))} placeholder="Cidade" hasError={hasErrorGlobal && !booking.address.city} />
                    <InputField isDark={isDark} label={T.input_room} value={booking.address.comp} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, comp: sanitizeInput(e.target.value) } }))} placeholder="Nº do Quarto" />
                  </div>
                )}
                {booking.locationType === 'motel' && (
                  <div className={`p-5 rounded-2xl border flex items-start gap-4 animate-fade-up ${isDark ? 'bg-pink-900/10 border-pink-900/30' : 'bg-pink-50 border-pink-100'}`}>
                    <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-pink-500/20 text-pink-400' : 'bg-pink-100 text-pink-600'}`}><Icon name="heart" size={20} /></div>
                    <p className={`text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>{T.motel_note}</p>
                  </div>
                )}
              </article>
            </section>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <section className="animate-fade-up max-w-2xl mx-auto space-y-8">
              <header className="text-center"><h2 className={`font-display font-bold text-3xl mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.select_time_title}</h2></header>
              <div className="relative w-full">
                <div ref={dateScrollRef} className="flex gap-3 overflow-x-auto snap-x py-2 scrollbar-hide w-full">
                  {daysArray.map((d, idx) => {
                    const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                    const mo = d.toLocaleDateString(lang === 'en' ? CONFIG.LOCALE_EN : CONFIG.LOCALE_PT, { month: 'short' }).replace('.', '');
                    return (
                      <button key={idx} onClick={() => { setBooking(b => ({ ...b, date: d.toISOString(), time: null })); vibrate(30); }}
                        className={`snap-center shrink-0 w-20 min-h-[90px] py-3 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border ${isSel ? 'bg-blue-600 border-blue-500 text-white' : isDark ? 'bg-[#181c25] border-zinc-800 text-zinc-400' : 'bg-white border-slate-200 text-slate-500'}`}>
                        <span className={`text-[10px] uppercase font-bold tracking-wider ${isSel ? 'text-blue-200' : ''}`}>{mo}</span>
                        <span className={`font-display text-2xl font-bold ${isSel ? 'text-white' : isDark ? 'text-zinc-200' : 'text-slate-900'}`}>{d.getDate()}</span>
                        <span className={`text-[10px] uppercase font-bold tracking-wider ${isSel ? 'text-blue-200' : ''}`}>{getDayLabel(d)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              {booking.date && generateTimeSlots.length > 0 && (
                <div className={`space-y-6 animate-fade-up ${hasErrorGlobal && !booking.time ? 'animate-shake' : ''}`}>
                  {[{ key: 'morning', label: T.morning, icon: 'sunrise', slots: groupedTimeSlots.morning }, { key: 'afternoon', label: T.afternoon, icon: 'sun', slots: groupedTimeSlots.afternoon }, { key: 'evening', label: T.evening, icon: 'sunset', slots: groupedTimeSlots.evening }].filter(g => g.slots.length > 0).map(group => (
                    <div key={group.key} className={`p-5 rounded-3xl border ${isDark ? 'bg-[#181c25] border-zinc-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                      <div className={`flex items-center gap-2 mb-4 text-[10px] uppercase font-bold tracking-widest ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                        <Icon name={group.icon} size={16} /> {group.label}
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {group.slots.map(t => {
                          const isRush = RUSH_HOURS.includes(t) && booking.locationType !== 'motel';
                          const isSel = booking.time === t;
                          return (
                            <button key={t} onClick={() => { setBooking(b => ({ ...b, time: t })); vibrate(30); }}
                              className={`relative flex flex-col items-center justify-center py-3 px-2 rounded-xl border text-sm font-bold min-h-[56px] w-full ${isSel ? isRush ? 'bg-amber-500 border-amber-500 text-amber-950' : 'bg-blue-600 border-blue-500 text-white' : isDark ? isRush ? 'bg-amber-900/20 border-amber-800/50 text-amber-500' : 'bg-zinc-800 border-zinc-700 text-zinc-300' : isRush ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                              {t}
                              {isRush && <span className={`text-[9px] font-bold uppercase mt-0.5 ${isSel ? 'text-amber-900' : isDark ? 'text-amber-500' : 'text-amber-600'}`}>+{formatMoney(RUSH_FEE, lang).replace('R$ ', 'R$')}</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  {Object.values(groupedTimeSlots).flat().some(t => RUSH_HOURS.includes(t)) && booking.locationType !== 'motel' && (
                    <div className={`flex items-start gap-3 p-4 rounded-2xl border text-xs font-bold ${isDark ? 'bg-amber-900/10 border-amber-800/40 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                      <Icon name="alert-circle" size={18} />
                      <p>Horários de pico possuem taxa de deslocamento (Uber).</p>
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <section className="animate-fade-up space-y-6 max-w-2xl mx-auto">
              <SmartTimer isDark={isDark} text={T.timer_text} />
              
              <article className={`p-5 sm:p-6 rounded-3xl border ${isDark ? 'bg-[#181c25] border-zinc-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <h3 className={`font-display font-bold text-xl mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.extras_title}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {DATA.extras.map((ex: any) => {
                    const price = booking.cart.some(i => i.type === 'pack') ? Math.floor(ex.price * 0.8) : ex.price;
                    const isActive = booking.extras[ex.id];
                    return (
                      <button key={ex.id} onClick={() => setBooking(b => ({ ...b, extras: { ...b.extras, [ex.id]: !b.extras[ex.id] } }))}
                        className={`flex items-center p-4 rounded-2xl border text-left gap-3 ${isActive ? isDark ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200' : isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                        <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? 'bg-blue-500 text-white' : isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-white border text-slate-500'}`}><Icon name={ex.icon} size={16} /></div>
                        <div className="flex-1">
                          <p className={`text-sm font-bold ${isActive ? isDark ? 'text-blue-400' : 'text-blue-700' : isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{ex.label}</p>
                          <span className={`text-[10px] font-bold ${isActive ? isDark ? 'text-blue-300' : 'text-blue-600' : isDark ? 'text-zinc-400' : 'text-slate-600'}`}>+{formatMoney(price, lang)}</span>
                        </div>
                      </button>
                    );
                  })}
                  <div className="col-span-1 sm:col-span-2 mt-2">
                    <InputField isDark={isDark} label="Pedido Especial / Fantasia (+R$ 150,00)" value={booking.customExtraText} onChange={(e: any) => setBooking(b => ({ ...b, customExtraText: e.target.value }))} icon="plus" placeholder="O que mais você deseja adicionar?" />
                  </div>
                </div>
              </article>

              {/* RESTAURAÇÃO DO SISTEMA DE CUPONS COMPLETO */}
              <article className={`p-5 sm:p-6 rounded-3xl border ${isDark ? 'bg-[#181c25] border-zinc-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <h3 className={`font-display font-bold text-xl mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.coupon_section}</h3>

                <div className="flex items-center gap-2 mb-5">
                  <input type="text" placeholder="Tem um código?" value={manualCoupon} onChange={(e) => setManualCoupon(e.target.value.toUpperCase())}
                    className={`flex-1 font-bold rounded-xl px-4 h-[44px] text-sm outline-none border transition-colors ${isDark ? 'bg-zinc-900 border-zinc-800 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'}`}
                  />
                  <Button onClick={applyManualCoupon} size="sm" variant="primary" className="!w-auto !h-[44px] !px-4 !flex-none">Aplicar</Button>
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
                  <div className={`p-4 rounded-2xl border border-dashed text-center text-xs font-bold ${isDark ? 'border-zinc-700 text-zinc-500' : 'border-slate-300 text-slate-500'}`}>{T.coupon_empty}</div>
                )}
              </article>

              <article className={`p-5 sm:p-6 rounded-3xl border ${hasErrorGlobal && !booking.payment ? 'animate-shake' : ''} ${isDark ? 'bg-[#181c25] border-zinc-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <h4 className={`font-display font-bold text-xl mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.payment_title}</h4>
                <div className="space-y-3">
                  {[{ id: 'pix', label: T.pay_pix, icon: 'smartphone' }, { id: 'card', label: T.pay_card, icon: 'credit-card' }, { id: 'money', label: T.pay_cash, icon: 'banknote' }].map(p => (
                    <button key={p.id} onClick={() => setBooking(b => ({ ...b, payment: p.id }))}
                      className={`w-full flex items-center gap-3 p-4 rounded-2xl border ${booking.payment === p.id ? 'bg-blue-600 border-blue-500 text-white' : isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                      <Icon name={p.icon} size={20} /><span className="flex-1 text-left text-sm font-bold">{p.label}</span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${booking.payment === p.id ? 'border-white' : isDark ? 'border-zinc-700' : 'border-slate-300'}`}>{booking.payment === p.id && <div className="w-2.5 h-2.5 rounded-full bg-white" />}</div>
                    </button>
                  ))}
                </div>
              </article>

              <article className={hasErrorGlobal && !booking.termsAccepted ? 'animate-shake' : ''}>
                <button onClick={() => setTermsOpen(true)} className={`w-full flex items-center justify-between p-5 rounded-3xl border gap-4 ${booking.termsAccepted ? isDark ? 'bg-emerald-900/20 border-emerald-800' : 'bg-emerald-50 border-emerald-200' : isDark ? 'bg-[#181c25] border-zinc-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${booking.termsAccepted ? isDark ? 'bg-emerald-900/40 text-emerald-500' : 'bg-emerald-100 text-emerald-600' : isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-500'}`}><Icon name="shield" size={24} /></div>
                    <div className="text-left">
                      <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.terms_title}</p>
                      <p className={`text-[10px] font-bold uppercase mt-0.5 ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{T.terms_read}</p>
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${booking.termsAccepted ? 'bg-emerald-500 border-emerald-500 text-white' : isDark ? 'border-zinc-700' : 'border-slate-300'}`}>{booking.termsAccepted && <Icon name="check" size={16} />}</div>
                </button>
              </article>
            </section>
          )}

          {/* STEP 4 - SUCCESS */}
          {step === 4 && (
            <section className="min-h-[70vh] flex flex-col items-center justify-center text-center animate-scale-in max-w-sm mx-auto px-4">
              <div className="relative mb-8">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 ${isDark ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-emerald-200 bg-emerald-50'}`}><Icon name="check" size={40} className="text-emerald-500" /></div>
              </div>
              <h2 className={`font-display font-bold text-3xl mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.success_title}</h2>
              <p className={`text-sm font-medium mb-8 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>{T.success_sub}</p>
              
              <div className="w-full space-y-4">
                <Button variant="whatsapp" size="lg" full icon="message" onClick={() => openExternal('whatsapp', generateWhatsAppMsg())}>
                  {T.whatsapp_btn}
                </Button>
                
                {/* BOTÃO PARA SALVAR NA AGENDA */}
                <Button variant="secondary" size="lg" full icon="calendar-plus" onClick={downloadICS}>
                  {T.calendar_btn}
                </Button>

                <button onClick={() => { setStep(0); setBooking({ ...booking, cart: [], termsAccepted: false, appliedCoupon: null, bookingId: `BOOK_${Date.now()}`, customExtraText: '' }); }} className={`w-full text-xs font-bold uppercase tracking-widest py-4 ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                  {T.back_home}
                </button>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* BOTTOM NAV */}
      {step >= 0 && step < 4 && booking.cart.length > 0 && (
        <nav className="fixed bottom-0 inset-x-0 p-3 sm:p-4 z-40 animate-slide-up pointer-events-none">
          <div className={`max-w-3xl mx-auto pointer-events-auto rounded-3xl overflow-hidden border shadow-2xl ${isDark ? 'bg-[#181c25]/95 backdrop-blur-xl border-zinc-800' : 'bg-white/95 backdrop-blur-xl border-slate-200'}`}>
            <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
              {step > 0 && <button onClick={() => setStep(s => s - 1)} className={`w-12 h-12 flex items-center justify-center rounded-xl border shrink-0 ${isDark ? 'border-zinc-700 bg-zinc-800 text-zinc-300' : 'border-slate-200 bg-slate-50 text-slate-700'}`}><Icon name="chevron-left" size={20} /></button>}
              <div className="flex-1 min-w-0 pl-1">
                <p className={`text-[10px] uppercase font-bold tracking-widest truncate ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{step === 3 ? T.total_label : T.subtotal}</p>
                <p className={`font-display font-bold text-xl sm:text-2xl leading-none truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{step === 3 ? formatMoney(financials.total, lang) : formatMoney(financials.sub, lang)}</p>
              </div>
              <button onClick={handleNextStep} className={`h-12 flex items-center gap-2 px-5 sm:px-6 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider shrink-0 transition-all ${isStepValid() ? step === 3 ? 'bg-[#25D366] text-white' : 'bg-blue-600 text-white' : isDark ? 'bg-zinc-800 text-zinc-500' : 'bg-slate-100 text-slate-400'}`}>
                {step === 3 ? <><Icon name="message" size={16} /> <span className="hidden sm:inline">{T.finish_btn}</span></> : <><span className="hidden sm:inline">{T.next_btn}</span> <Icon name="chevron-right" size={16} /></>}
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* TERMS MODAL */}
      {termsOpen && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div role="dialog" className={`relative w-full max-w-lg max-h-[85vh] rounded-3xl flex flex-col border shadow-2xl animate-slide-up ${isDark ? 'bg-[#181c25] border-zinc-800' : 'bg-white border-slate-200'}`}>
            <div className={`flex items-center justify-between p-5 border-b shrink-0 ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
              <h3 className={`font-display font-bold text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.rules_complete}</h3>
              <button onClick={() => setTermsOpen(false)} className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-500'}`}><Icon name="x" size={18} /></button>
            </div>
            <div className="overflow-y-auto flex-1 p-5 space-y-4">
              {DATA.rules.map((rule: Rule, i: number) => <RuleItem key={i} rule={rule} isDark={isDark} />)}
            </div>
            <div className={`p-5 border-t shrink-0 ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
              <Button full size="lg" onClick={() => { setBooking(b => ({ ...b, termsAccepted: true })); setTermsOpen(false); }}>{T.agree_terms}</Button>
            </div>
          </div>
        </div>
      )}

      {/* LEVEL UP POPUP */}
      {levelUpPopup && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div role="dialog" className={`relative w-full max-w-sm rounded-3xl p-6 sm:p-8 text-center border shadow-2xl animate-scale-in ${isDark ? 'bg-[#181c25] border-amber-900/50' : 'bg-white border-amber-200'}`}>
            <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-5 bg-gradient-to-br from-amber-400 to-amber-600 text-amber-950 shadow-lg`}><Icon name="trophy" size={32} /></div>
            <h3 className={`font-display font-bold text-3xl mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.levelup_popup_title}</h3>
            <p className={`text-sm font-medium leading-relaxed mb-6 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>{T.levelup_popup_msg}</p>
            <Button full size="lg" variant="amber" onClick={() => { setLevelUpPopup(false); vibrate(50); }}>{T.level_redeem}</Button>
          </div>
        </div>
      )}
    </>
  );
}
