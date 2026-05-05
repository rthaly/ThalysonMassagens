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
  SECRET_TOKEN: 'THALY_SECURE_V8',
  START_HOUR: 8,
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
// GLOBAL STYLES — Refined Luxury Aesthetic
// ==================================================================================
const GlobalStyles = memo(({ isDark }: { isDark: boolean }) => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

    *, *::before, *::after { box-sizing: border-box; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }

    :root {
      --font-sans: 'DM Sans', sans-serif;
      --font-display: 'DM Serif Display', serif;
      --c-bg: ${isDark ? '#080a0f' : '#f5f4f0'};
      --c-surface: ${isDark ? '#0f1117' : '#ffffff'};
      --c-surface2: ${isDark ? '#161b26' : '#f8f7f4'};
      --c-border: ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)'};
      --c-border-strong: ${isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.16)'};
      --c-text: ${isDark ? '#f0ede8' : '#1a1714'};
      --c-text-2: ${isDark ? '#9a9590' : '#6b6560'};
      --c-text-3: ${isDark ? '#5a5550' : '#9a9590'};
      --c-blue: #3b82f6;
      --c-blue-bright: #60a5fa;
      --c-amber: #f59e0b;
      --c-emerald: #10b981;
      --c-rose: #f43f5e;
      --c-glow-blue: rgba(59,130,246,0.35);
      --c-glow-amber: rgba(245,158,11,0.35);
      --c-glow-emerald: rgba(16,185,129,0.35);
    }

    html, body {
      background-color: var(--c-bg);
      color: var(--c-text);
      font-family: var(--font-sans);
      transition: background-color 0.4s ease, color 0.4s ease;
      overscroll-behavior-y: none;
      -webkit-tap-highlight-color: transparent;
    }

    .font-display { font-family: var(--font-display); }

    /* Scrollbar */
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--c-border-strong); border-radius: 2px; }

    /* Animations */
    @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideRight { from { transform: translateX(110%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes scaleIn { from { transform: scale(0.88); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
    @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
    @keyframes checkPop { 0% { transform: scale(0) rotate(-15deg); } 60% { transform: scale(1.25) rotate(5deg); } 100% { transform: scale(1) rotate(0); } }
    @keyframes barGrow { from { width: 0; } to { width: var(--bar-w, 100%); } }
    @keyframes floatUp { 0% { opacity: 0; transform: translateY(6px) scale(0.95); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
    @keyframes progressBar { 0% { background-position: 0 0; } 100% { background-position: 40px 40px; } }
    @keyframes cartBounce { 0% { transform: scale(1); } 40% { transform: scale(1.05); } 80% { transform: scale(0.95); } 100% { transform: scale(1); } }
    @keyframes glowPulse { 0%, 100% { box-shadow: 0 0 0 0 var(--c-glow-blue); } 50% { box-shadow: 0 0 20px 6px var(--c-glow-blue); } }
    @keyframes gradientShift { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
    @keyframes toast-in { from { transform: translateY(-20px) scale(0.94); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
    @keyframes success-ring { 0% { transform: scale(0.6); opacity: 1; } 100% { transform: scale(2.4); opacity: 0; } }
    @keyframes stagger-1 { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes stagger-2 { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes stagger-3 { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes confettiDrop { 0% { transform: translateY(-20px) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
    @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }

    .animate-fade-up { animation: fadeUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-fade-in { animation: fadeIn 0.3s ease forwards; }
    .animate-slide-right { animation: slideRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-scale-in { animation: scaleIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
    .animate-check-pop { animation: checkPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
    .animate-spin { animation: spin 0.7s linear infinite; }
    .animate-ping { animation: ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite; }
    .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
    .animate-bounce-slow { animation: bounce 2.5s ease-in-out infinite; }
    .animate-cart-bounce { animation: cartBounce 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }
    .animate-glow-pulse { animation: glowPulse 2.5s ease-in-out infinite; }
    .animate-toast-in { animation: toast-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
    .animate-stagger-1 { animation: stagger-1 0.5s 0.05s both; }
    .animate-stagger-2 { animation: stagger-2 0.5s 0.15s both; }
    .animate-stagger-3 { animation: stagger-3 0.5s 0.25s both; }
    .animate-float-up { animation: floatUp 0.3s ease both; }
    .animate-shake { animation: shake 0.3s cubic-bezier(.36,.07,.19,.97) both; }

    /* Gradient text */
    .text-gradient-blue { background: linear-gradient(135deg, #60a5fa, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .text-gradient-amber { background: linear-gradient(135deg, #fcd34d, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .text-gradient-main { background: linear-gradient(135deg, var(--c-text), var(--c-text-2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

    /* Glass surfaces */
    .glass { background: ${isDark ? 'rgba(15,17,23,0.85)' : 'rgba(255,255,255,0.85)'}; backdrop-filter: blur(24px) saturate(160%); -webkit-backdrop-filter: blur(24px) saturate(160%); border: 1px solid var(--c-border); }
    .glass-strong { background: ${isDark ? 'rgba(15,17,23,0.96)' : 'rgba(255,255,255,0.97)'}; backdrop-filter: blur(40px) saturate(200%); -webkit-backdrop-filter: blur(40px) saturate(200%); }

    /* Noise texture overlay */
    .noise::after { content: ''; position: absolute; inset: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E"); opacity: 0.4; pointer-events: none; border-radius: inherit; }

    /* Cards */
    .card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease; }
    .card-hover:hover { transform: translateY(-3px); }

    /* Category color vars */
    .cat-relax { --cat-color: #3b82f6; --cat-glow: rgba(59,130,246,0.2); }
    .cat-express { --cat-color: #10b981; --cat-glow: rgba(16,185,129,0.2); }
    .cat-final { --cat-color: #f59e0b; --cat-glow: rgba(245,158,11,0.2); }
    .cat-care { --cat-color: #ec4899; --cat-glow: rgba(236,72,153,0.2); }

    /* Service card selected ring */
    .service-card-selected { box-shadow: 0 0 0 2px var(--c-blue), 0 8px 32px rgba(59,130,246,0.18); }
    .service-card-selected-amber { box-shadow: 0 0 0 2px var(--c-amber), 0 8px 32px rgba(245,158,11,0.18); }

    /* Loading bar */
    @keyframes loadingBar { 0% { transform: translateX(-100%) scaleX(0.5); } 50% { transform: translateX(0%) scaleX(1); } 100% { transform: translateX(100%) scaleX(0.5); } }
    .loading-bar-anim { animation: loadingBar 1.8s ease-in-out infinite; }

    /* Emoji */
    .emoji-icon { font-style: normal; display: inline-block; line-height: 1; vertical-align: middle; text-align: center; }

    /* Tab transition */
    .tab-content { animation: fadeUp 0.35s ease both; }

    /* Confetti */
    .confetti-piece { position: absolute; width: 8px; height: 8px; border-radius: 1px; animation: confettiDrop var(--dur, 3s) var(--delay, 0s) ease-in forwards; }

    /* Button ripple */
    button { position: relative; overflow: hidden; }

    /* Form focus ring */
    .input-field:focus { outline: none; border-color: var(--c-blue); box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }

    /* Number badge */
    .badge { display: inline-flex; align-items: center; justify-content: center; min-width: 20px; height: 20px; padding: 0 5px; border-radius: 10px; font-size: 10px; font-weight: 700; line-height: 1; }
  `}} />
));

// ==================================================================================
// UTILITIES & HAPTICS
// ==================================================================================
const sanitizeInput = (v: string): string => String(v || '').replace(/[<>&"']/g, '');
const validateAddress = (a: any): boolean => !!(a.street && a.number && a.district && a.city);

// Haptic feedback function
const vibrate = (pattern: number | number[] = 50) => {
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  } catch (e) { /* Silent fail if unsupported */ }
};

// Mask utility
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
      if (key.startsWith('@thaly_app')) {
        try { JSON.parse(localStorage.getItem(key) || '{}'); } catch { localStorage.removeItem(key); }
      }
    });
  } catch {}
};

// ==================================================================================
// ICON COMPONENT
// ==================================================================================
const Icon = memo(({ name, size = 20, className = '', isEmoji = false }: { name: string; size?: number; className?: string; isEmoji?: boolean }) => {
  if (isEmoji) return <span className={`emoji-icon shrink-0 ${className}`} style={{ fontSize: size }} role="img" aria-label={name}>{name}</span>;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`} aria-hidden="true">
      <path d={ICON_PATHS[name] || ''} />
    </svg>
  );
});

// ==================================================================================
// TYPES
// ==================================================================================
interface ServiceItem { id: string; min: number; price: number; icon: string; isEmoji?: boolean; tag: string; title: string; desc: string; details: string; fullPrice?: number; savings?: number; type?: string; popular?: boolean; category?: 'relax' | 'express' | 'final' | 'care'; }
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
  if (lang === 'en') return [
    { n: "Gustavo", loc: "Bela Vista - SP", t: "Thalyson arrived on time when I needed to relax after a tense month. The at-home experience was incredible. He manages to leave us completely relaxed, his hands have an unparalleled technique. The relief was immediate, I got up feeling 20lbs lighter. I want it again.", serv: "Fusion Experience", s: 5 },
    { n: "Giovana", loc: "Hotel Portal da Mata, Santa Fé", t: "You have blessed hands and I flew! I really needed this rest, this peace. You were super respectful the whole time and relaxed me so much. Thank you! ❤️", serv: "Sensory Massage", s: 5 },
    { n: "Osvaldo", loc: "Santa Fé do Sul", t: "TODAY couldn't end BETTER, being attended by Thalyson at home in a massage session by his MAGIC HANDS!!! What a delight! The 4 essential pillars of his work are bases to transform the service into a UNIQUE SENSATION that generates value for the body, combining super EMPATHY with the client, without forgetting EFFICIENCY, agility, and clarity. Thalyson always focuses on serving the client well, from beginning to end it is surprising! TOTALLY WORTH IT. 👏👏👏", serv: "Classic Massage", s: 5 },
    { n: "Bruno", loc: "SP - Bela Vista", t: "Thalyson, I want to say your massage was very well executed. I highly recommend it.", serv: "Classic Massage", s: 5 },
    { n: "Alan", loc: "SP - Bela Vista", t: "I liked it a lot, I left feeling lighter. You can tell he is great at what he does.", serv: "Sensory Massage", s: 5 },
    { n: "Tiago", loc: "SP - Bela Vista", t: "Thalyson has surreal energy. The massage was perfect, best of my life.", serv: "Fusion Experience", s: 5 },
    { n: "Roberto", loc: "São Paulo - Jardins", t: "The feeling of emptiness and peace I felt after the session was indescribable. The ending was extremely powerful, releasing a load of tension I'd carried for months. Impeccable professionalism.", serv: "Fusion Experience", s: 5 },
    { n: "Carla", loc: "Rio Preto", t: "I felt welcomed on a level I didn't expect. He has a firm grip that relaxes the muscles and at the same time awakens dormant sensations. Total relief at the end.", serv: "Naturist Classic", s: 5 },
    { n: "Lucas", loc: "Londrina", t: "Being married, discretion was my priority and I was attended with total secrecy. The tantric massage allowed me to rediscover my own body. The energy discharge at the end was intense.", serv: "Nuru Massage", s: 5 },
    { n: "Felipe", loc: "Votuporanga", t: "A rare connection experience. I was shaking after the session, in a good way. It was a moment to completely empty my mind. Highly recommended for something beyond the physical.", serv: "Sensory Massage", s: 5 },
    { n: "Mariana", loc: "Jales", t: "Respectful touch, but with the right intensity. I was able to disconnect from work problems and focus only on my pleasure and well-being. It was liberating.", serv: "Classic Massage", s: 5 },
    { n: "Gustavo", loc: "Hotel Ibis - SP", t: "The combination of relaxing and sensory massage created a perfect journey. The climax of the session was vigorous and restorative. Absurd feeling of lightness at the end.", serv: "Fusion Experience", s: 5 },
    { n: "Ricardo", loc: "Fernandópolis", t: "I found a rare professionalism. I felt comfortable to let go of my blocks. I left there feeling 20lbs lighter, physically and emotionally.", serv: "Reverse Massage", s: 5 },
    { n: "Sérgio", loc: "Santa Fé", t: "I suffer from anxiety and this session was more effective than many therapies. The human connection was real, and the final climax was the strongest and most liberating I've ever experienced.", serv: "Nuru Massage", s: 5 },
    { n: "Beatriz", loc: "Rio Preto", t: "Warm hands and firm presence. The environment was charged with positive energy. I was able to deeply relax and forget the chaos outside.", serv: "Naturist Classic", s: 5 },
    { n: "Marcelo", loc: "SP - Centro", t: "I went with no expectations and left surprised. The lingam massage was executed with precise and respectful technique. The pleasure was intense and genuine.", serv: "Fusion Experience", s: 5 },
    { n: "André", loc: "Motel K2", t: "Absolute discretion. Thalyson is a person with very good energy and knows what he's doing. It was a necessary and revitalizing escape from my routine.", serv: "Reverse Massage", s: 5 },
    { n: "Juliana", loc: "Londrina", t: "Delicadeza e força alternadas nos momentos exatos. Me senti viva de novo. Obrigada pelo carinho e respeito com meu corpo.", serv: "Classic Massage", s: 5 },
    { n: "Paulo", loc: "São Paulo - Paulista", t: "A complete experience. From the comforting initial touch to the final explosion of energy. It was intense and left my legs trembling from so much relaxation.", serv: "Fusion Experience", s: 5 },
    { n: "Vinícius", loc: "Jales", t: "Took a weight off my shoulders I didn't even know I was carrying. The ending was powerful and necessary. Will definitely return.", serv: "Sensory Massage", s: 5 },
    { n: "Fernanda", loc: "Santa Fé", t: "Super respectful with my body. It was a very beautiful energy exchange, intense and unhurried. I felt renewed.", serv: "Nuru Massage", s: 5 },
    { n: "Eduardo", loc: "Rio Preto", t: "Sensational. His technique to build and then release energy is out of this world. It was a massive physical and mental relief.", serv: "Fusion Experience", s: 5 },
    { n: "Caio", loc: "SP - Consolação", t: "Impeccable service at my hotel. Punctual, discreet, and with hands that know exactly where to touch to relieve tension.", serv: "Classic Massage", s: 5 },
    { n: "Larissa", loc: "Votuporanga", t: "Deep relaxation. I forgot everything outside. I recommend it to anyone who needs to reconnect with themselves.", serv: "Naturist Classic", s: 5 },
    { n: "Otávio", loc: "Londrina", t: "It was intense from start to finish. An energy discharge I desperately needed. I felt clean inside.", serv: "Nuru Massage", s: 5 },
    { n: "Diego", loc: "Fernandópolis", t: "The best part was not feeling judged. I could be myself, express my pleasure, and enjoy every second of care.", serv: "Reverse Massage", s: 5 }
  ];
  return [
    { n: "Gustavo", loc: "Bela Vista - SP", t: "O Thalyson chegou na hora certa, quando eu precisava relaxar após as tensões do mês. A experiência em casa foi incrível. Ele consegue deixar a gente completamente relaxado, as mãos dele tem uma técnica sem igual. O alívio foi imediato, levantei parecendo 10kg mais leve. Quero de novo.", serv: "Experiência Fusion", s: 5 },
    { n: "Giovana", loc: "Hotel Portal da Mata, Santa Fé", t: "Você tem mãos abençoadas e eu voeeei! Precisava muito desse descanso, dessa paz. Foi super respeitoso a todo tempo e me relaxou demais. Obrigada! ❤️", serv: "Massagem Sensorial", s: 5 },
    { n: "Osvaldo", loc: "Santa Fé do Sul", t: "HOJE, 10/02/26 não poderia ter teminado MELHOR o dia, sendo atendido por Thalyson em casa numa sessão de massagem por suas MÃOS MÁGICAS !!! Que delícia! Os 4 pilares essenciais do seu trabalho são bases para transformar o atendimento em uma SENSAÇÃO UNICA que gera valores pro corpo, combinando o aspecto de super EMPATIA com o cliente, sem esquecer da EFICIENCIA e agilidade, clareza durante a sessão, tornando ha, uma visão da PERFEIÇÃO de executar este trabalho de massagem com maestria! Thalyson foca sempre no propósito de servir bem o cliente, desde o início ao fim q é surpreendente! VALE A PENA. 👏👏👏", serv: "Massagem Clássica", s: 5 },
    { n: "Bruno", loc: "SP - Bela Vista", t: "Thalyson, quero dizer que sua massagem foi muito bem executada. Recomendo muito.", serv: "Massagem Clássica", s: 5 },
    { n: "Alan", loc: "SP - Bela Vista", t: "Gostei bastante, saí mais leve. Da pra ver que ele manda bem no que faz.", serv: "Massagem Sensorial", s: 5 },
    { n: "Tiago", loc: "SP - Bela Vista", t: "O Thalyson tem uma energia surreal. A massagem foi perfeita, melhor da minha vida.", serv: "Experiência Fusion", s: 5 },
    { n: "Roberto", loc: "São Paulo - Jardins", t: "A sensação de vazio e paz que senti após a sessão foi indescritível. A finalização foi extremamente potente, liberando uma carga de tensão que eu carregava há meses. Profissionalismo impecável.", serv: "Experiência Fusion", s: 5 },
    { n: "Carla", loc: "Rio Preto", t: "Me senti acolhida em um nível que não esperava. Ele tem uma pegada firme que relaxa a musculatura e ao mesmo tempo desperta sensações adormecidas. O alívio no final foi total.", serv: "Relaxante Clássica Naturista", s: 5 },
    { n: "Lucas", loc: "Londrina", t: "Sendo casado, a discrição era minha prioridade e fui atendido com total sigilo. A massagem tântrica me permitiu redescobrir meu próprio corpo. A descarga de energia no final foi intensa.", serv: "Massagem Nuru", s: 5 },
    { n: "Felipe", loc: "Votuporanga", t: "Uma experiência de conexão rara. Fiquei trêmulo após a sessão, de uma forma boa. Foi um momento de esvaziar a mente completamente. Recomendo para quem busca algo além do físico.", serv: "Massagem Sensorial", s: 5 },
    { n: "Mariana", loc: "Jales", t: "Toque respeitoso, mas com a intensidade certa. Consegui me desligar dos problemas do trabalho e focar apenas no meu prazer e bem-estar. Foi libertador.", serv: "Massagem Clássica", s: 5 },
    { n: "Gustavo", loc: "Hotel Ibis - SP", t: "A combinação da massagem relaxante com a sensitiva criou uma jornada perfeita. O ápice da sessão foi vigoroso e restaurador. Sensação de leveza absurda ao final.", serv: "Experiência Fusion", s: 5 },
    { n: "Ricardo", loc: "Fernandópolis", t: "Encontrei um profissionalismo raro. Me senti à vontade para soltar minhas travas. Saí de lá me sentindo 10kg mais leve, física e emocionalmente.", serv: "Massagem Reversa Clássica", s: 5 },
    { n: "Sérgio", loc: "Santa Fé", t: "Sofro de ansiedade e essa sessão foi mais eficaz que muitas terapias. A conexão humana foi real, e o clímax final foi o mais forte e libertador que já experimentei.", serv: "Massagem Nuru", s: 5 },
    { n: "Beatriz", loc: "Rio Preto", t: "Mãos quentes e presença firme. O ambiente ficou carregado de uma energia positiva. Consegui relaxar profundamente e esquecer o caos lá fora.", serv: "Relaxante Clássica Naturista", s: 5 },
    { n: "Marcelo", loc: "SP - Centro", t: "Fui sem expectativa e saí surpreendido. A massagem lingam foi executada com uma técnica precisa e respeitosa. O prazer foi intenso e genuíno.", serv: "Experiência Fusion", s: 5 },
    { n: "André", loc: "Motel K2", t: "Discrição absoluta. O Thalyson é uma pessoa de energia muito boa e sabe o que faz. Foi um escape necessário e revitalizante da minha rotina.", serv: "Massagem Reversa Clássica", s: 5 },
    { n: "Juliana", loc: "Londrina", t: "Delicadeza e força alternadas nos momentos exatos. Me senti viva de novo. Obrigada pelo carinho e respeito com meu corpo.", serv: "Massagem Clássica", s: 5 },
    { n: "Paulo", loc: "São Paulo - Paulista", t: "Uma experiência completa. Do toque inicial reconfortante até a explosão final de energia. Foi intenso e me deixou com as pernas bambas de tanto relaxamento.", serv: "Experiência Fusion", s: 5 },
    { n: "Vinícius", loc: "Jales", t: "Tirou um peso das minhas costas que eu nem sabia que carregava. A finalização foi potente e necessária. Voltarei com certeza.", serv: "Massagem Sensorial", s: 5 },
    { n: "Fernanda", loc: "Santa Fé", t: "Super respeitoso com meu corpo. Foi uma troca de energia muito bonita, intensa e sem pressa. Me senti renovada.", serv: "Massagem Nuru", s: 5 },
    { n: "Eduardo", loc: "Rio Preto", t: "Sensacional. A técnica dele para construir e depois liberar a energia é coisa de outro mundo. Foi um alívio físico e mental gigantesco.", serv: "Experiência Fusion", s: 5 },
    { n: "Caio", loc: "SP - Consolação", t: "Atendimento impecável no meu hotel. Pontual, discreto e com uma mão que sabe exatamente onde tocar para aliviar a tensão.", serv: "Massagem Clássica", s: 5 },
    { n: "Larissa", loc: "Votuporanga", t: "Relaxamento profundo. Esqueci de tudo lá fora. Recomendo para qualquer pessoa que precise se reconectar consigo mesma.", serv: "Relaxante Clássica Naturista", s: 5 },
    { n: "Otávio", loc: "Londrina", t: "Foi intenso do início ao fim. Uma descarga de energia que eu estava precisando desesperadamente. Me senti limpo por dentro.", serv: "Massagem Nuru", s: 5 },
    { n: "Diego", loc: "Fernandópolis", t: "A melhor parte foi não me sentir julgado. Pude ser eu mesmo, expressar meu prazer e aproveitar cada segundo de cuidado.", serv: "Massagem Reversa Clássica", s: 5 }
  ];
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
      { id: 'pes', category: 'express', min: 40, price: p.pes, icon: "🦶", isEmoji: true, tag: isEn ? "FOOT RELIEF" : "ALÍVIO NOS PÉS", title: isEn ? "Foot Massage" : "Sessão nos Pés", desc: isEn ? "Complete relief for tired feet after a long day." : "Alívio completo para pés cansados após longas jornadas de trabalho.", details: isEn ? "Step 1: Foot reflexology\nStep 2: Deep pressure points\nStep 3: Plantar fascia release" : "Passo 1: Reflexologia podal focada\nPasso 2: Pressão profunda em pontos de tensão\nPasso 3: Liberação de fáscia plantar" },
      { id: 'maos', category: 'express', min: 40, price: p.maos, icon: "🖐️", isEmoji: true, tag: isEn ? "HAND RELIEF" : "ALÍVIO NAS MÃOS", title: isEn ? "Hand Massage" : "Sessão nas Mãos", desc: isEn ? "Release tension from typing and working with your hands." : "Libere a tensão acumulada de digitar e trabalhar excessivamente com as mãos.", details: isEn ? "Step 1: Joint stretching\nStep 2: Deep palm massage\nStep 3: Forearm and wrist relief" : "Passo 1: Alongamento articular inicial\nPasso 2: Massagem profunda nas palmas e dedos\nPasso 3: Alívio para punhos e antebraço" },
      { id: 'combo_pm', category: 'express', min: 40, price: p.combo_pm, icon: "✨", isEmoji: true, tag: isEn ? "COMBO" : "COMBO", title: isEn ? "Hands & Feet Combo" : "Combo Mãos e Pés", desc: isEn ? "The ultimate extremity relaxation, combining the best of both." : "O relaxamento definitivo para as extremidades do corpo, unindo o melhor dos dois mundos.", details: isEn ? "Step 1: Deep hand massage\nStep 2: Foot reflexology\nStep 3: Total extremity relief" : "Passo 1: Massagem profunda e detalhada nas mãos\nPasso 2: Reflexologia podal focada\nPasso 3: Alívio total de tensões periféricas" },
      { id: 'relaxante', category: 'relax', min: 40, price: p.relax, icon: "user-check", tag: isEn ? "MUSCLE RELIEF" : "ALÍVIO MUSCULAR", title: isEn ? "Classic Massage (Quick Relief)" : "Massagem Clássica (Alívio Rápido)", desc: isEn ? "Stiff back from the office chair? Tense body? This takes that giant weight off your shoulders and makes you sleep like an angel." : "Costas travadas da cadeira do escritório? Corpo tenso? Essa é para tirar com as mãos aquele peso gigante que você carrega e te fazer dormir como um anjo.", details: isEn ? "Step 1: Use of wooden rollers to start kneading body parts\nStep 2: Soft touch manually to release hard muscles\nStep 3: Focus on full body relaxation (no intimate touch)\nStep 4: The 'restart' button for those who work too hard" : "Passo 1: Uso de rolos de madeira para preparar e amassar as tensões\nPasso 2: Toque manual e suave para soltar a musculatura dura\nPasso 3: Foco no relaxamento do corpo todo (sem toques íntimos)\nPasso 4: Sensação de 'reiniciar', voltando a dormir como um anjo" },
      { id: 'naturista', category: 'relax', min: 40, price: p.naturista, icon: "sun", tag: isEn ? "ZERO TIES" : "ZERO AMARRAS", title: isEn ? "Naturist Classic (Freedom)" : "Clássica Naturista (Liberdade)", desc: isEn ? "Coming home and taking off work clothes is good, right? Here we elevate that. Total freedom, no clothes, light touches to loosen every muscle." : "Chegar em casa e tirar a roupa do trabalho é bom, né? Aqui elevamos isso. Liberdade total, sem roupas, toques leves para soltar cada músculo do seu corpo.", details: isEn ? "Step 1: Starts with a full classic massage (both undressed)\nStep 2: Exact pressure applied to dismantle daily rigidity\nStep 3: Deep full body relief without any intimate touches\nStep 4: Ends with a deep feeling of lightness and acceptance" : "Passo 1: Início com massagem clássica completa (ambos despidos)\nPasso 2: Pressão exata para desmanchar a rigidez do dia a dia\nPasso 3: Alívio profundo no corpo todo (não possui toques íntimos)\nPasso 4: Finaliza com sensação de leveza e aceitação, sem julgamentos" },
      { id: 'crossfit', category: 'relax', min: 60, price: p.crossfit, icon: "🏋️‍♂️", isEmoji: true, tag: isEn ? "DEEP RECOVERY" : "RECUPERAÇÃO PROFUNDA", title: isEn ? "Crossfit Lovers" : "Massagem Crossfiteiro", desc: isEn ? "Heavy workouts demand deep recovery. A sports massage with a firm and deep grip, focused on untying tension knots and releasing stiff muscles after training." : "Treino pesado exige uma recuperação à altura. Uma massagem desportiva com pegada firme e profunda, focada em desmanchar os nós de tensão e liberar a musculatura travada após os treinos.", details: isEn ? "Step 1: Vigorous friction to warm up fatigued muscles\nStep 2: Heavy myofascial release focusing on legs, back, and shoulders\nStep 3: Use of thermal ointments for direct pain relief\nStep 4: Guided stretching to restore body mobility" : "Passo 1:Massagem com toques mais fortes em regiões do corpo dolorida \nPasso 2: Liberação relaxante toque preciso com foco em pernas, costas e ombros\nPasso 3: Uso de pomadas térmicas para alívio direto da dor\nPasso 4: Alongamentos para devolver a mobilidade do corpo" },
      { id: 'sensitiva', category: 'final', min: 60, price: p.sens, icon: "sparkles", tag: isEn ? "REDUCES ANXIETY" : "REDUZ ANSIEDADE", title: isEn ? "Sensory Massage (Mental Reset)" : "Massagem Sensorial (Reset Mental)", desc: isEn ? "Mind won't turn off at bedtime? Close your eyes and let subtle touches give you full-body shivers." : "A cabeça não desliga na hora de dormir? Feche os olhos e deixe toques sutis arrepiarem seu corpo inteiro.", details: isEn ? "Step 1: Starts with a classic massage to release initial tension\nStep 2: Subtle stimuli across the body that give goosebumps\nStep 3: Energy buildup focused on emptying your mind\nStep 4: Climax focused on an intense release of pleasure" : "Passo 1: Início com massagem clássica para soltar as tensões corporais\nPasso 2: Estímulos sutis pelo corpo que arrepiam a pele\nPasso 3: Construção da energia com foco em esvaziar a cabeça\nPasso 4: Finalização focada numa liberação intensa de prazer" },
      { id: 'mista', category: 'final', min: 60, price: p.titan, icon: "zap", tag: isEn ? "BEST OF BOTH WORLDS" : "O MELHOR DOS 2 MUNDOS", title: isEn ? "Fusion Experience (Most Complete)" : "Experiência Fusion (A Mais Completa)", desc: isEn ? "Why choose when you can have it all? First I take the pain from your back, then I take you to a climax that makes any weekly problem disappear." : "Por que escolher se você pode ter tudo? Primeiro eu tiro a dor das suas costas, depois te levo a um clímax que faz qualquer problema da semana desaparecer.", details: isEn ? "Step 1: Starts with a classic massage breaking muscle tension\nStep 2: Changes rhythm to intimate body-to-body contact\nStep 3: Involves your senses in a crescendo of heat and desire\nStep 4: Ends with a liberating release that recharges your batteries" : "Passo 1: Início com massagem clássica para quebrar a tensão muscular\nPasso 2: Muda o ritmo para contato íntimo corpo a corpo e roçar de barba (massagista de cueca)\nPasso 3: Envolve seus sentidos numa crescente de calor e desejo\nPasso 4: Termina com um gozo libertador que recarrega suas energias para o resto do dia" },
      { id: 'reversa', category: 'final', min: 60, price: p.reversa, icon: "refresh-cw", tag: isEn ? "REAL CONTACT" : "CONTATO REAL", title: isEn ? "Reverse Massage (Classic + Lingam)" : "Massagem Reversa (Clássica com Lingam)", desc: isEn ? "Miss human warmth and intimacy? I do a 30-min massage on you, relaxing your body, and then you take control and do it on me." : "Sente falta de calor humano e intimidade? Eu faço aproximadamente 30 minutos de massagem em você, relaxando seu corpo, e depois você assume o controle e faz em mim.", details: isEn ? "Step 1: Starts with a relaxing classic massage for approx 30min\nStep 2: Then you take control, feel free to touch me\nStep 3: No cold 'client and professional' vibe, pure real connection\nStep 4: A delicious dynamic of reciprocity that fulfills you" : "Passo 1: Inicia com massagem clássica relaxante por aprox. 30min\nPasso 2: O controle passa a ser seu, sinta-se à vontade para me tocar\nPasso 3: Quebra da frieza de 'cliente/profissional', pura conexão real\nPasso 4: Finalização mútua e dinâmica de reciprocidade que te realiza" },
      { id: 'nuru', category: 'final', min: 60, price: p.nuru, icon: "star", popular: true, tag: isEn ? "TOTAL SURRENDER" : "ENTREGA TOTAL", title: isEn ? "Nuru Massage (Most Desired)" : "Massagem Nuru (A Mais Desejada)", desc: isEn ? "When stress is at its limit, only this solves it. Gliding gel, parts of my body sliding over yours, and a surrender so deep your legs will shake." : "Quando o nível de estresse está no limite, só isso resolve. Gel que desliza, partes do meu corpo deslizando sobre o seu, e uma entrega tão profunda que suas pernas vão tremer.", details: isEn ? "Step 1: Starts with a full classic massage to loosen the body\nStep 2: Lots of warm gel for perfect continuous sliding\nStep 3: Skin on skin, I use my body to relax yours\nStep 4: The sweatiest and most intense journey for you to release" : "Passo 1: Início com massagem clássica completa para soltar o corpo\nPasso 2: Aplicação de gel para um deslizamento perfeito\nPasso 3: Pele na pele, uso meu corpo para relaxar o seu\nPasso 4: A viagem final mais intensa para você gozar e apagar" },
      { id: 'depilacao', category: 'care', min: 60, price: p.depil, icon: "scissors", tag: isEn ? "PRACTICALITY" : "PRATICIDADE", title: isEn ? "Full Body Trim" : "Aparo Corporal Completo", desc: isEn ? "Rush doesn't let you take care of yourself? I'll solve it. Leave with a clean, light body ready for the week." : "A correria não te deixa cuidar de si mesmo? Eu resolvo. Fique com o corpo limpo, leve e preparado para a semana.", details: isEn ? "Step 1: Zero or Guard 3 trim with clippers\nStep 2: Focus on chest, back, abdomen, and legs\nStep 3: Done in the comfort and total secrecy of your space\nStep 4: Leaves you with less sweat and much more confidence daily" : "Passo 1: Aparo zero ou Pente 3 com máquina profissional\nPasso 2: Foco detalhado no peito, costas, abdômen e pernas\nPasso 3: Feito no conforto e total sigilo do seu espaço\nPasso 4: Finalização para um corpo com menos suor e mais confiança" }
    ] as ServiceItem[],
    plans: [
      { id: 'pack_essencial', type: 'pack', title: isEn ? "Survival Kit (2x)" : "Kit Sobrevivência (2x)", price: p.pack1.v, fullPrice: p.pack1.full, savings: p.pack1.save, desc: isEn ? "The perfect combo, scheduled on different days. One day to cure pain, another for the mind." : "A dobradinha perfeita, com sessões agendadas em dias diferentes na semana. Um dia para curar a dor, outro para a mente.", details: isEn ? "1x Classic (to unlock the whole body)\n1x Sensory (to empty the head and have intense pleasure)\nSessions scheduled separately (e.g., one per week)\nIdeal to guarantee perfect sleep nights in the month" : "1x Clássica (para destravar o corpo todo)\n1x Sensorial (para esvaziar a cabeça e ter prazer intenso)\nSessões agendadas separadamente (ex: uma por semana)\nIdeal para garantir noites de sono perfeito no mês", tag: isEn ? "PERFECT SLEEP" : "SONO PERFEITO", icon: "layers" },
      { id: 'pack_interativo', type: 'pack', title: isEn ? "Real Connection Combo (2x)" : "Combo Conexão Real (2x)", price: p.pack2.v, fullPrice: p.pack2.full, savings: p.pack2.save, desc: isEn ? "Missing human contact? Two encounters scheduled separately in the month to forget loneliness." : "Sente falta de contato humano? Dois encontros agendados separadamente no mês para esquecer a solidão e ter troca.", details: isEn ? "1x Fusion (the perfect middle ground between pain relief and pleasure)\n1x Reverse (the day you satisfy the urge to touch and explore)\nSessions scheduled separately in your month\nTotal focus on breaking the cold routine with human warmth" : "1x Fusion (o meio-termo perfeito entre curar a dor e gozar)\n1x Reversa (o dia que você mata a vontade de tocar e explorar)\nSessões agendadas separadamente no seu mês\nFoco total em quebrar a rotina fria com muito calor humano", tag: isEn ? "END OF LONELINESS" : "FIM DA SOLIDÃO", icon: "heart" },
      { id: 'pack_premium', type: 'pack', title: isEn ? "Boss Monthly Plan (3x)" : "Mensalidade do Chefe (3x)", price: p.pack3.v, fullPrice: p.pack3.full, savings: p.pack3.save, desc: isEn ? "You grind all month, you deserve to be treated like a king. Three weeks guaranteed with the best relaxation." : "Você rala o mês inteiro, merece ser tratado como rei. Três semanas do mês garantidas com o melhor relaxamento.", details: isEn ? "1x Naturist (freedom and muscle tension release)\n1x Fusion (custom-made relaxation and pleasure)\n1x Nuru (absolute ecstasy with hot gel and sliding)\nThree separate encounters ensuring your month is stress-free" : "1x Naturista (liberdade e quebra de tensão muscular)\n1x Fusion (relaxamento e prazer sob medida)\n1x Nuru (o êxtase absoluto com gel quente e deslizamento)\nTrês encontros separados garantindo seu mês livre de estresse", tag: isEn ? "MONTH'S REWARD" : "O REWARD DO MÊS", icon: "award" }
    ] as ServiceItem[],
    extras: [
      { id: 'hair_trim', price: p.extras.hair_trim, icon: "✂️", isEmoji: true, label: isEn ? "Trim (Extra)" : "Aparo (Extra)", desc: isEn ? "Maintenance in 2 body parts to look flawless." : "Manutenção em 2 partes do corpo para ficar impecável." },
      { id: 'more_time', price: p.extras.more_time, icon: "⏱️", isEmoji: true, label: isEn ? "Extended Time (+30m)" : "Tempo Estendido (+30m)", desc: isEn ? "Because when it's good, we don't want it to end." : "Porque quando está bom, não queremos que acabe." },
      { id: 'touch', price: p.extras.touch, icon: "🖐️", isEmoji: true, label: isEn ? "Organic Interaction" : "Interação Orgânica", desc: isEn ? "Feel free to participate and touch as well." : "Sinta-se livre para participar e tocar também." },
      { id: 'aroma', price: p.extras.aroma, icon: "🌸", isEmoji: true, label: isEn ? "Deep Aromatherapy" : "Cheiro bom no ar", desc: isEn ? "Essential oils that lower your mental frequency." : "Óleos essenciais que baixam a sua frequência mental." },
      { id: 'pain_relief', price: p.extras.pain_relief, icon: "💊", isEmoji: true, label: isEn ? "Extra Focus on Pain" : "Foco Extra em Dores", desc: isEn ? "Use of technical ointment to treat strong pain." : "Uso de pomada técnica para tratar dores fortes." },
      { id: 'dominador', price: p.extras.dominador, icon: "🔥", isEmoji: true, label: isEn ? "Active & Dominant" : "Massagista Ativo e Dominador", desc: isEn ? "I take full control at the end of the session." : "Eu assumo o controle total e ativo na finalização." },
      { id: 'oral', price: p.extras.oral, icon: "👅", isEmoji: true, label: isEn ? "Oral Included" : "Oral na Sessão", desc: isEn ? "Oral intimacy included in the experience." : "Estímulo oral íntimo incluído na nossa experiência." },
      { id: 'beijos', price: p.extras.beijos, icon: "💋", isEmoji: true, label: isEn ? "Kisses Included" : "Beijos Liberados", desc: isEn ? "Kisses and affection allowed during the session." : "Carinho e beijos completamente liberados no atendimento." },
      { id: 'prostatico', price: p.extras.prostatico, icon: "💦", isEmoji: true, label: isEn ? "Prostatic Massage" : "Prostático Manual", desc: isEn ? "Manual prostatic stimulation with lube." : "Estimulação prostática manual intensa com dedos e lubrificante." }
    ],
    faq: [
      { q: isEn ? "How do the touch and the ending work?" : "Como o toque e a finalização funcionam?", a: isEn ? "Everything is conducted with extreme respect, entirely focused on your comfort and pleasure. The goal is to create a safe space for you to surrender, relax your mind, and reach a liberating climax that zeroes out stress." : "Tudo é conduzido com extremo respeito, focado inteiramente no seu conforto e prazer. O objetivo é criar um espaço seguro para que você possa se entregar, relaxar a mente e alcançar um gozo libertador que zera o estresse." },
      { q: isEn ? "Where is our meeting location?" : "Onde é o local do nosso encontro?", a: isEn ? "I come to you, in the comfort of your home or hotel. I arrive at the scheduled time and transform the environment (be it your bed or sofa) into a true refuge of peace to take care of you." : "Vou até você, no conforto da sua residência ou hotel. Chego no horário marcado e transformo o ambiente (seja sua cama ou sofá) em um verdadeiro refúgio de paz para cuidarmos de você." },
      { q: isEn ? "How should I prepare for the session?" : "Como devo me prepare para a sessão?", a: isEn ? "With an open heart! The most important thing is that you take a relaxing shower before my arrival. The shower helps loosen initial muscles and gets your body ready for total surrender." : "De coração aberto! O mais importante é que você tome um banho relaxante antes da minha chegada. O banho ajuda a soltar os músculos iniciais e deixa seu corpo pronto para a entrega total." },
      { q: isEn ? "I'm ashamed of my body, what now?" : "Tenho vergonha do meu corpo, e agora?", a: isEn ? "Forget about that. My work is pure welcoming. During the session, there is no judgment, only the desire to provide relief, deep relaxation, and lots of pleasure." : "Esqueça isso. Meu trabalho é puro acolhimento. Durante a sessão, não existe julgamento, existe apenas a vontade de proporcionar alívio, relaxamento profundo e muito prazer." },
      { q: isEn ? "Are my points and level saved in the app?" : "Meus pontos e nível ficam salvos no aplicativo?", a: isEn ? "Yes! To facilitate your access without requiring passwords, your progress (XP) is saved automatically on your phone. Just remember: if you clear your device's browsing history (cache) or change phones, this data will restart from zero." : "Sim! Para facilitar seu acesso sem exigir senhas, seu progresso (XP) fica salvo automaticamente no seu celular. Apenas lembre-se: se você limpar o histórico de navegação do seu aparelho ou trocar de celular, esses dados recomeçarão do zero." }
    ],
    rules: [
      { icon: "shower", title: isEn ? "The Prep Shower" : "A Ducha Preparatória", description: isEn ? "A prior shower is essential. The warm water starts the relaxation and prepares your skin for the perfect, intense touch." : "O banho prévio é essencial. A água morna começa o relaxamento e prepara sua pele para o toque perfeito e intenso." },
      { icon: "hand", title: isEn ? "Welcoming and Respect" : "Acolhimento e Respeito", description: isEn ? "I take care of you and your pleasure. Mutual respect is key for the magic to happen freely and naturally." : "Eu cuido de você e do seu prazer. O respeito mútuo é a chave para que a magia aconteça de forma livre e natural." },
      { icon: "heart", title: isEn ? "Absolute Surrender" : "Entrega Absoluta", description: isEn ? "Forget the outside world. This time is yours to relax your mind, melt tensions, and just enjoy the moment." : "Esqueça o mundo lá fora. Este tempo é seu para relaxar a mente, desmanchar as tensões e apenas gozar o momento." },
      { icon: "shield", title: isEn ? "Health and Integrity" : "Saúde e Integridade", description: isEn ? "I declare that I am healthy and cleared to receive a massage." : "Declaro que estou saudável, liberado para receber a massagem." }
    ],
    text: {
      welcome: isEn ? "Welcome," : "Bem-vindo,",
      welcome_anon: isEn ? "allow yourself." : "permita-se.",
      choose_sub: isEn ? "I know how heavy the routine is. Choose how you want to be cared for and feel pleasure today." : "Sei o quanto a rotina está pesando. Escolha como quer ser cuidado e sentir prazer hoje.",
      level_label: isEn ? "Your Care Journey" : "Sua Jornada de Cuidado",
      tab_packs: isEn ? "Monthly Plans" : "Planos Mensais",
      tab_single: isEn ? "Single Sessions" : "Sessões Avulsas",
      next_btn: isEn ? "Continue" : "Continuar",
      finish_btn: isEn ? "Complete Booking" : "Realizar Agendamento",
      loading: isEn ? "Preparing your space..." : "Preparando seu espaço...",
      toast_select_item: isEn ? "Add at least one service to continue." : "Adicione ao menos um serviço para continuar.",
      toast_select_date: isEn ? "Choose a date and time for our encounter." : "Escolha data e horário para nosso encontro.",
      toast_fill_name: isEn ? "Fill in your name to continue." : "Preencha seu nome para continuar.",
      toast_fill_addr: isEn ? "Fill in the location so I can visit you." : "Preencha o local para eu ir até você.",
      toast_accept_terms: isEn ? "Please read and accept our agreement." : "Por favor, leia e aceite nosso acordo.",
      toast_coupon_success: isEn ? "Gift applied! Discount activated. 🎁" : "Presente aplicado! Desconto ativado. 🎁",
      toast_coupon_invalid: isEn ? "Invalid or expired code." : "Código inválido ou expirado.",
      toast_cep_found: isEn ? "Address loaded automatically." : "Endereço carregado automaticamente.",
      toast_cep_error: isEn ? "CEP not found." : "CEP não encontrado.",
      details_label: isEn ? "WHAT YOU WILL EXPERIENCE:" : "COMO É O PASSO A PASSO:",
      select_time_title: isEn ? "Choose the perfect moment" : "Escolha o momento perfeito",
      location_title: isEn ? "Where will our encounter be?" : "Onde será nosso encontro?",
      extras_title: isEn ? "Add something special" : "Adicione algo especial",
      coupon_section: isEn ? "Your Benefits" : "Seus Benefícios",
      payment_title: isEn ? "Payment method (at the meeting)" : "Pagamento (no encontro)",
      terms_title: isEn ? "Delivery Agreement" : "Acordo de Entrega",
      success_title: isEn ? "Almost there!" : "Quase lá!",
      success_sub: isEn ? "WhatsApp is opening automatically to confirm. If it doesn't open, tap the button below." : "O WhatsApp está sendo aberto para confirmarmos. Caso não abra, use o botão abaixo.",
      whatsapp_btn: isEn ? "Open WhatsApp" : "Abrir WhatsApp",
      back_home: isEn ? "Start over" : "Recomeçar",
      timer_text: isEn ? "Cart saved for" : "Carrinho salvo por",
      input_name: isEn ? "Your name or nickname" : "Seu nome ou apelido",
      input_cep: isEn ? "ZIP Code (CEP)" : "CEP",
      input_addr: isEn ? "Street or Avenue" : "Rua ou Avenida",
      input_num: isEn ? "Number" : "Número",
      input_district: isEn ? "Neighborhood" : "Bairro",
      input_city: isEn ? "City" : "Cidade",
      input_comp: isEn ? "Apt, Block, etc (Optional)" : "Apto, Bloco, etc (Opcional)",
      input_hotel: isEn ? "Hotel name" : "Nome do Hotel",
      input_room: isEn ? "Room / Suite Number" : "Número do Quarto / Suíte",
      agree_terms: isEn ? "I read and agree to the terms" : "Li e aceito as regras",
      faq_title: isEn ? "Frequently Asked Questions" : "Perguntas Frequentes",
      reviews_title: isEn ? "Those who allowed themselves:" : "Quem já se permitiu:",
      empty_date: isEn ? "Tap a day above to see available times." : "Toque num dia para ver os horários.",
      empty_slots: isEn ? "Schedule full for this day. Try the next one?" : "Agenda cheia para este dia. Tentar o próximo?",
      total_label: isEn ? "Total" : "Total",
      subtotal: isEn ? "Subtotal" : "Subtotal",
      discount: isEn ? "Discount" : "Desconto",
      pix_discount: isEn ? "Pix (3% OFF)" : "Benefício Pix (3%)",
      welcome_popup_title: isEn ? "Welcome!" : "Seja bem-vindo!",
      welcome_popup_msg: isEn ? "I'm glad you decided to take time to care for yourself. Most people forget about themselves. Here is a gift for our first time." : "Fico feliz que você decidiu tirar um tempo para se cuidar. A maioria das pessoas esquece de si mesma. Aqui está um presente para nossa primeira vez.",
      welcome_popup_warning: isEn ? "⚠️ Your progress is saved in this browser. Avoid clearing cache data." : "⚠️ Seu progresso é salvo neste navegador. Evite limpar os dados de cache.",
      levelup_popup_title: isEn ? "Level Up!" : "Evolução!",
      levelup_popup_msg: isEn ? "Your consistency generated rewards. A new exclusive benefit has been unlocked." : "Sua constância gerou recompensas. Um novo benefício exclusivo foi desbloqueado.",
      get_coupon: isEn ? "Claim My Gift" : "Resgatar Meu Presente",
      rules_complete: isEn ? "Mutual Agreement" : "Acordo de Entrega Mútua",
      media_discount: isEn ? "Portfolio Discount (1%)" : "Desconto Portfólio (1%)",
      media_title: isEn ? "Support my work (Optional)" : "Apoiar meu trabalho (Opcional)",
      media_desc: isEn ? "Allow anonymous aesthetic photos (body outline only, no face/intimacy) for my portfolio and get 1% OFF." : "Permita fotos estéticas anônimas (apenas contorno do corpo, sem rosto) para meu portfólio e ganhe 1% OFF.",
      media_bonus: isEn ? "Allow for 1% OFF" : "Liberar para 1% OFF",
      uber_notice: isEn ? "Travel fee (Uber) will be calculated and confirmed via WhatsApp." : "Taxa de deslocamento (Uber) será calculada e confirmada no WhatsApp.",
      motel_note: isEn ? "My private suite address will be sent via WhatsApp after booking." : "O endereço da minha suíte privada será enviado pelo WhatsApp após a reserva.",
      menu_title: isEn ? "Menu" : "Menu",
      level_yours: isEn ? "Your Level" : "Seu Nível",
      level_current: isEn ? "XP" : "XP",
      level_journey: isEn ? "Progress" : "Progresso",
      menu_warning: isEn ? "* Progress saved in this browser. Avoid clearing cache." : "* Progresso salvo neste navegador. Evite limpar o cache.",
      theme_title: isEn ? "Appearance" : "Aparência",
      theme_dark: isEn ? "Dark" : "Escuro",
      theme_light: isEn ? "Light" : "Claro",
      refer_btn: isEn ? "Refer Someone" : "Indicar Alguém",
      share_text: isEn ? 'I found the best massage to relieve all stress.' : 'Encontrei a melhor massagem para tirar todo o estresse.',
      header_tensions: isEn ? "moments of relief" : "momentos de alívio",
      step_when: isEn ? "When" : "Quando",
      step_where: isEn ? "Where" : "Onde",
      step_summary: isEn ? "Summary" : "Resumo",
      cart_title: isEn ? "Cart:" : "Carrinho:",
      cart_edit: isEn ? "Edit" : "Editar",
      time_choose: isEn ? "Pick a time" : "Escolha o horário",
      time_rush: isEn ? "Rush (+15)" : "Pico (+15)",
      loc_home: isEn ? "Your Home" : "Sua Casa",
      loc_motel: isEn ? "My Suite" : "Minha Suíte",
      loc_hotel: isEn ? "Hotel" : "Hotel",
      summary_title: isEn ? "Order Summary" : "Resumo do Pedido",
      summary_items: isEn ? "SERVICES" : "SERVIÇOS",
      summary_extras: isEn ? "EXTRAS" : "EXTRAS",
      summary_info: isEn ? "SESSION DETAILS" : "DETALHES DA SESSÃO",
      summary_loc_home: isEn ? "At your residence" : "Em sua residência",
      summary_loc_motel: isEn ? "At my private suite" : "Na minha suíte",
      summary_loc_hotel: isEn ? "At a hotel" : "Em hotel",
      coupon_applied: isEn ? "Coupon Applied" : "Cupom Aplicado",
      xp_guaranteed: isEn ? "XP guaranteed" : "XP garantidos",
      media_granted: isEn ? "Authorization Granted ✓" : "Autorização Concedida ✓",
      media_support: isEn ? "Support the Work" : "Apoiar o Trabalho",
      pay_pix: isEn ? "Pix (3% OFF)" : "Pix (3% OFF)",
      pay_card: isEn ? "Card" : "Cartão",
      pay_cash: isEn ? "Cash" : "Dinheiro",
      terms_read: isEn ? "Read the rules" : "Ler as regras",
      level_redeem: isEn ? "Claim Reward" : "Resgatar Recompensa",
      today: isEn ? "TODAY" : "HOJE",
      tomorrow: isEn ? "TOMORROW" : "AMANHÃ",
      popular_badge: isEn ? "✦ Most Desired" : "✦ Mais Desejada",
      from: isEn ? "From" : "De",
      savings: isEn ? "YOU SAVE" : "ECONOMIA",
      items_selected: isEn ? "selected" : "selecionado(s)",
      btn_finish_short: isEn ? "Finish" : "Finalizar",
      btn_next_short: isEn ? "Next" : "Avançar",
      msg_level_keep1: isEn ? "Only" : "Apenas",
      msg_level_keep2: isEn ? "XP to unlock" : "XP para desbloquear",
      msg_rush_fee: isEn ? "Rush Fee" : "Taxa de Pico",
      toast_loaded: isEn ? "Progress loaded! 💾" : "Progresso carregado! 💾",
      toast_cart_toggle: isEn ? "Cart updated." : "Carrinho atualizado.",
      toast_pix_copied: isEn ? "PIX key copied!" : "Chave PIX copiada!",
      toast_copy: isEn ? "Copied!" : "Copiado!",
      coupon_placeholder: isEn ? "Have a code? Type here" : "Tem um código? Digite aqui",
      coupon_apply: isEn ? "Apply" : "Aplicar",
      morning: isEn ? "Morning" : "Manhã",
      afternoon: isEn ? "Afternoon" : "Tarde",
      evening: isEn ? "Evening" : "Noite",
    },
    reviews: getFullReviews(lang)
  };
};

// ==================================================================================
// REFINED COMPONENTS
// ==================================================================================

// Toast Notification
const ToastContainer = memo(({ toasts, isDark }: { toasts: any[]; isDark: boolean }) => (
  <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 pointer-events-none w-full max-w-sm px-4">
    {toasts.map(t => (
      <div key={t.id} role="alert" className={`animate-toast-in pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-2xl ${t.type === 'error' ? 'bg-red-950/95 border-red-800 text-red-200' : isDark ? 'bg-zinc-900/98 border-white/10 text-white' : 'bg-white/98 border-black/8 text-slate-900'}`}>
        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${t.type === 'error' ? 'bg-red-800 text-red-200' : 'bg-emerald-500/20 text-emerald-400'}`}>
          <Icon name={t.type === 'error' ? 'alert-circle' : 'check'} size={14} />
        </div>
        <span className="text-xs font-medium leading-snug">{t.msg}</span>
      </div>
    ))}
  </div>
));

// Refined Button
const Button = memo(({ children, onClick, variant = 'primary', size = 'md', disabled = false, full = false, icon, className = '', loading = false, ariaLabel }: any) => {
  const base = "relative inline-flex items-center justify-center font-semibold tracking-wide transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed select-none active:scale-[0.97] gap-2 shrink-0 overflow-hidden";
  const variants: Record<string, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/25 hover:shadow-blue-900/40 hover:-translate-y-0.5",
    secondary: "bg-white/8 border border-white/12 text-white hover:bg-white/12",
    whatsapp: "bg-[#25D366] text-white hover:bg-[#22c55e] shadow-lg shadow-green-900/25 hover:-translate-y-0.5",
    outline: "border border-current text-current hover:bg-white/8",
    ghost: "text-current hover:bg-white/8",
    amber: "bg-amber-500 text-zinc-950 hover:bg-amber-400 shadow-lg shadow-amber-900/25 font-bold hover:-translate-y-0.5",
  };
  const sizes: Record<string, string> = {
    sm: "h-10 text-[11px] px-4 rounded-xl",
    md: "h-12 text-xs px-5 rounded-2xl",
    lg: "h-14 text-sm px-7 rounded-2xl",
    xl: "h-16 text-sm px-8 rounded-2xl",
  };
  return (
    <button type="button" onClick={onClick} disabled={disabled || loading} aria-label={ariaLabel}
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${full ? 'w-full' : ''} ${className}`}>
      {loading
        ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        : <>{icon && <Icon name={icon} size={18} />}{children}</>}
    </button>
  );
});

// Refined Input
const InputField = memo(({ label, value, onChange, placeholder, icon, type = 'text', isDark = true, hasError = false, disabled = false, maxLength }: any) => (
  <div className={`space-y-1.5 w-full ${hasError ? 'animate-shake' : ''}`}>
    {label && (
      <label className={`text-[10px] font-semibold uppercase tracking-widest pl-1 ${hasError ? 'text-red-400' : isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{label}</label>
    )}
    <div className="relative group">
      {icon && (
        <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${hasError ? 'text-red-400' : isDark ? 'text-zinc-500 group-focus-within:text-blue-400' : 'text-slate-400 group-focus-within:text-blue-600'}`}>
          <Icon name={icon} size={18} />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        className={`input-field w-full h-12 rounded-2xl text-sm font-medium transition-all border outline-none disabled:opacity-50 disabled:cursor-not-allowed ${icon ? 'pl-10 pr-4' : 'px-4'} ${hasError
          ? 'border-red-500/50 bg-red-950/20 text-red-300 placeholder:text-red-500/40'
          : isDark
            ? 'border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus:border-blue-500/60 focus:bg-white/8'
            : 'border-black/10 bg-black/4 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-blue-50/50'
        }`}
      />
    </div>
  </div>
));

// Side Menu
const SideMenu = memo(({ isOpen, onClose, isDark, toggleTheme, user, T }: any) => {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[60] animate-fade-in" onClick={onClose} />
      <aside className={`fixed top-0 right-0 h-full w-80 max-w-[88vw] z-[70] p-7 shadow-2xl animate-slide-right flex flex-col ${isDark ? 'bg-[#0a0c12] border-l border-white/6' : 'bg-white border-l border-black/6'}`}>
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-display text-xl">{T.menu_title}</h2>
          <button onClick={onClose} className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${isDark ? 'hover:bg-white/8 text-zinc-400' : 'hover:bg-black/5 text-slate-500'}`}>
            <Icon name="x" size={20} />
          </button>
        </div>

        <div className={`mb-6 p-5 rounded-2xl border relative overflow-hidden ${isDark ? 'bg-blue-950/30 border-blue-500/20' : 'bg-blue-50 border-blue-200'}`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <p className={`text-[9px] uppercase font-semibold tracking-widest mb-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{T.level_yours}</p>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-4xl">{user.xp}</span>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>XP</span>
          </div>
          <p className={`text-[10px] mt-3 font-light leading-relaxed border-t pt-3 ${isDark ? 'border-white/8 text-zinc-500' : 'border-black/8 text-slate-500'}`}>{T.menu_warning}</p>
        </div>

        <nav className="flex-1 space-y-2">
          <button onClick={toggleTheme} className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${isDark ? 'hover:bg-white/6 text-zinc-300' : 'hover:bg-black/4 text-slate-700'}`}>
            <div className="flex items-center gap-3">
              <Icon name={isDark ? "moon" : "sun"} size={18} className={isDark ? "text-blue-400" : "text-blue-600"} />
              <span className="text-sm font-medium">{T.theme_title}</span>
            </div>
            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg ${isDark ? 'bg-white/8 text-zinc-400' : 'bg-black/6 text-slate-500'}`}>{isDark ? T.theme_dark : T.theme_light}</span>
          </button>

          <button onClick={() => { if (navigator.share) navigator.share({ title: 'Thalyson Massagens', text: T.share_text, url: window.location.href }); }} className={`w-full flex items-center gap-3 p-4 rounded-xl transition-colors ${isDark ? 'hover:bg-white/6 text-zinc-300' : 'hover:bg-black/4 text-slate-700'}`}>
            <Icon name="share" size={18} className="text-emerald-400" />
            <span className="text-sm font-medium">{T.refer_btn}</span>
          </button>
        </nav>
      </aside>
    </>
  );
});

// Review Card
const ReviewCard = memo(({ review, isDark }: { review: Review; isDark: boolean }) => (
  <article className={`h-full flex flex-col p-6 rounded-3xl border transition-all duration-300 ${isDark ? 'bg-white/4 border-white/8 hover:bg-white/6 hover:border-white/14' : 'bg-white border-slate-200 shadow-sm hover:shadow-md'}`}>
    <div className="flex items-start justify-between mb-4 gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-11 h-11 rounded-full flex items-center justify-center text-base font-bold font-display shrink-0 ${isDark ? 'bg-blue-500/15 text-blue-300 border border-blue-500/20' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
          {review.n.charAt(0)}
        </div>
        <div className="min-w-0">
          <span className={`text-sm font-semibold block ${isDark ? 'text-white' : 'text-slate-900'}`}>{review.n}</span>
          <span className={`text-[10px] block tracking-wide ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{review.loc}</span>
        </div>
      </div>
      <div className="flex gap-0.5 shrink-0">
        {[...Array(5)].map((_, i) => (
          <Icon key={i} name="star" size={12} className={i < review.s ? 'text-amber-400 fill-amber-400' : isDark ? 'text-zinc-700' : 'text-slate-200'} />
        ))}
      </div>
    </div>

    <div className={`inline-flex self-start items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-semibold uppercase tracking-wider mb-4 border ${isDark ? 'bg-amber-500/10 border-amber-500/25 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
      <Icon name="award" size={10} /> {review.serv}
    </div>

    <p className={`text-[13px] leading-relaxed font-light italic flex-1 ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>"{review.t}"</p>
  </article>
));

// FAQ Item
const FAQItem = memo(({ q, a, isDark }: { q: string; a: string; isDark: boolean }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border-b last:border-b-0 ${isDark ? 'border-white/8' : 'border-slate-200'}`}>
      <button onClick={() => setOpen(!open)} className="w-full py-5 flex items-center justify-between text-left gap-4 group">
        <span className={`text-sm font-medium leading-snug ${isDark ? 'text-white/90 group-hover:text-white' : 'text-slate-800 group-hover:text-slate-900'}`}>{q}</span>
        <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300 ${open ? isDark ? 'bg-blue-600 border-blue-500 text-white rotate-180' : 'bg-blue-600 border-blue-500 text-white rotate-180' : isDark ? 'border-white/12 text-zinc-400' : 'border-slate-200 text-slate-400'}`}>
          <Icon name="chevron-down" size={14} />
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{a}</p>
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
    <div className={`flex items-center gap-4 p-4 rounded-2xl border ${isDark ? 'bg-blue-950/30 border-blue-500/20' : 'bg-blue-50 border-blue-200'}`}>
      <div className={`relative w-12 h-12 shrink-0`}>
        <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
          <circle cx="18" cy="18" r="15" fill="none" stroke={isDark ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.12)'} strokeWidth="2.5" />
          <circle cx="18" cy="18" r="15" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeDasharray={`${pct * 0.942} 100`} className="transition-all duration-1000" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon name="clock" size={16} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
        </div>
      </div>
      <div>
        <p className={`text-[10px] font-semibold uppercase tracking-widest mb-1 ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>{text}</p>
        <p className={`font-display text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>{fmt(time)}</p>
      </div>
    </div>
  );
});

// Rule Item
const RuleItem = memo(({ rule, isDark }: { rule: Rule; isDark: boolean }) => (
  <div className={`flex gap-4 p-5 rounded-2xl border border-transparent transition-colors ${isDark ? 'hover:bg-white/5 hover:border-white/8' : 'hover:bg-slate-50 hover:border-slate-200'}`}>
    <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-blue-500/15 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
      <Icon name={rule.icon} size={20} />
    </div>
    <div>
      <h4 className={`text-sm font-semibold mb-1 font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>{rule.title}</h4>
      <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{rule.description}</p>
    </div>
  </div>
));

// Service Card
const ServiceCard = memo(({ service, isInCart, onToggle, isDark, T, isPremium = false }: any) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className={`relative rounded-3xl border transition-all duration-300 overflow-hidden card-hover ${isInCart
        ? isPremium
          ? 'service-card-selected-amber border-amber-500/70 bg-amber-500/6'
          : 'service-card-selected border-blue-500/70 bg-blue-500/6'
        : isDark
          ? 'bg-white/4 border-white/8 hover:border-white/16 hover:bg-white/6'
          : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'
      }`}
    >
      {/* Popular badge */}
      {service.popular && (
        <div className={`absolute top-4 right-4 z-10 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${isPremium ? 'bg-amber-500 text-zinc-950' : 'bg-blue-600 text-white'}`}>
          {T.popular_badge}
        </div>
      )}

      {/* Selected overlay indicator */}
      {isInCart && (
        <div className={`absolute top-4 left-4 z-10 w-6 h-6 rounded-full flex items-center justify-center animate-check-pop ${isPremium ? 'bg-amber-500 text-zinc-950' : 'bg-blue-600 text-white'}`}>
          <Icon name="check" size={13} />
        </div>
      )}

      <div className="p-6 cursor-pointer" onClick={() => onToggle(service)}>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 ${isPremium ? isDark ? 'bg-amber-500/12 border-amber-500/25 text-amber-400' : 'bg-amber-50 border-amber-200' : isDark ? 'bg-white/8 border-white/10 text-zinc-200' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
            <Icon name={service.icon} size={22} isEmoji={service.isEmoji} />
          </div>
          <div className="text-right flex-1 min-w-0">
            {service.fullPrice && (
              <p className={`text-[10px] font-medium line-through mb-0.5 ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}>
                {T.from} {formatMoney(service.fullPrice, 'pt')}
              </p>
            )}
            <p className={`font-display text-2xl leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatMoney(service.price, 'pt')}</p>
            {service.savings && (
              <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 ${isDark ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                {T.savings} {formatMoney(service.savings, 'pt')}
              </span>
            )}
          </div>
        </div>

        <div className={`inline-block text-[9px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full border mb-3 ${isPremium ? isDark ? 'bg-amber-500/10 border-amber-500/25 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-700' : isDark ? 'bg-white/6 border-white/10 text-zinc-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
          {service.tag}
        </div>
        <h3 className={`text-base font-semibold leading-snug mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{service.title}</h3>
        <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{service.desc}</p>
      </div>

      {/* Expandable details */}
      <div className={`border-t mx-6 mb-0 ${isDark ? 'border-white/8' : 'border-slate-100'}`}>
        <button onClick={() => setExpanded(!expanded)} className={`w-full flex items-center justify-between py-3.5 text-[10px] font-semibold uppercase tracking-widest transition-colors ${isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-400 hover:text-slate-600'}`}>
          {T.details_label}
          <Icon name={expanded ? 'chevron-down' : 'chevron-right'} size={14} className={`transition-transform duration-300 ${expanded ? 'rotate-0' : ''}`} />
        </button>
        <div className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-80 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="space-y-1.5">
            {service.details.split('\n').map((line: string, i: number) => (
              <div key={i} className="flex items-start gap-2">
                <span className={`text-[10px] font-bold mt-0.5 shrink-0 ${isPremium ? isDark ? 'text-amber-400' : 'text-amber-600' : isDark ? 'text-blue-400' : 'text-blue-600'}`}>→</span>
                <span className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{line}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

// Category Section
const CATEGORY_CONFIG: Record<string, { color: string; glow: string; borderColor: string; bg: string; lightBg: string; lightBorder: string }> = {
  relax: { color: '#3b82f6', glow: 'rgba(59,130,246,0.12)', borderColor: 'rgba(59,130,246,0.25)', bg: 'rgba(59,130,246,0.05)', lightBg: 'rgba(59,130,246,0.04)', lightBorder: 'rgba(59,130,246,0.15)' },
  express: { color: '#10b981', glow: 'rgba(16,185,129,0.12)', borderColor: 'rgba(16,185,129,0.25)', bg: 'rgba(16,185,129,0.05)', lightBg: 'rgba(16,185,129,0.04)', lightBorder: 'rgba(16,185,129,0.15)' },
  final: { color: '#f59e0b', glow: 'rgba(245,158,11,0.12)', borderColor: 'rgba(245,158,11,0.25)', bg: 'rgba(245,158,11,0.05)', lightBg: 'rgba(245,158,11,0.04)', lightBorder: 'rgba(245,158,11,0.15)' },
  care: { color: '#ec4899', glow: 'rgba(236,72,153,0.12)', borderColor: 'rgba(236,72,153,0.25)', bg: 'rgba(236,72,153,0.05)', lightBg: 'rgba(236,72,153,0.04)', lightBorder: 'rgba(236,72,153,0.15)' },
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
  const [couponInput, setCouponInput] = useState('');
  const [cartBounce, setCartBounce] = useState(false);
  const [isFetchingCep, setIsFetchingCep] = useState(false);
  const [hasErrorGlobal, setHasErrorGlobal] = useState(false);

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
    setToasts(p => [...p.slice(-3), { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4500);
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
        // Falha silenciosa em caso de erro na API, usuário pode digitar manual
      } finally {
        setIsFetchingCep(false);
      }
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
        const ex = DATA.extras.find(e => e.id === k);
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

  const getNextLevelInfo = () => {
    if (user.xp >= 800) { const need = 500 - ((user.xp - 800) % 500); return { needed: need, reward: DATA.levels[3].reward }; }
    const next = DATA.levels.find(l => l.xpNeeded > user.xp);
    return next ? { needed: next.xpNeeded - user.xp, reward: next.reward } : null;
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

  const handleApplyCoupon = useCallback(() => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    const found = user.coupons.find(c => c.code.toUpperCase() === code && !user.usedCoupons.includes(c.code));
    if (found) {
      setBooking(b => ({ ...b, appliedCoupon: found }));
      addToast(T.toast_coupon_success, 'success');
      setCouponInput('');
      vibrate(50);
    } else {
      addToast(T.toast_coupon_invalid, 'error');
      vibrate([50, 100, 50]);
    }
  }, [couponInput, user.coupons, user.usedCoupons, T, addToast]);

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
      return `✅ *${item.title}*\n_${item.desc}_\n*${isEn ? 'Details' : 'Detalhes'}:*\n${lines}`;
    }).join('\n\n');
    let locTxt = '', mapQ = '';
    if (booking.locationType === 'home') { const a = `${booking.address.street}, ${booking.address.number} - ${booking.address.district}, ${booking.address.city}`; locTxt = `🏠 *${isEn ? 'Residence' : 'Residência'}*\n📍 ${a}\n📝 ${booking.address.comp || '-'}`; mapQ = a; }
    else if (booking.locationType === 'motel') locTxt = `🏩 *${isEn ? 'My Suite' : 'Minha Suíte'}*\n⚠️ (${isEn ? 'Address confirmed on WhatsApp' : 'Endereço confirmado no WhatsApp'})`;
    else { const a = `${booking.address.placeName}, ${booking.address.city}`; locTxt = `🏨 *Hotel: ${booking.address.placeName}*\n📍 ${booking.address.city}\n🚪 ${isEn ? 'Room' : 'Quarto'}: ${booking.address.comp || '-'}`; mapQ = a; }
    const extrasList = Object.keys(booking.extras || {}).filter(k => booking.extras[k]).map(k => { const ex = DATA.extras.find(e => e.id === k); return ex ? `➕ ${ex.label}` : ''; }).filter(Boolean).join('\n');
    let prices = `💵 *${isEn ? 'Subtotal' : 'Subtotal'}:* ${formatMoney(f.sub, lang)}`;
    if (f.disc > 0) prices += `\n🎁 *${booking.appliedCoupon?.code}:* -${formatMoney(f.disc, lang)}`;
    if (f.mediaDisc > 0) prices += `\n📸 *${isEn ? 'Portfolio' : 'Portfólio'}:* -${formatMoney(f.mediaDisc, lang)}`;
    if (f.pixDisc > 0) prices += `\n💸 *PIX (3%):* -${formatMoney(f.pixDisc, lang)}`;
    if (f.rushFee > 0) prices += `\n🚗 *${isEn ? 'Rush Fee' : 'Taxa Pico'}:* +${formatMoney(f.rushFee, lang)}`;
    prices += `\n\n💰 *${isEn ? 'TOTAL' : 'TOTAL'}: ${formatMoney(f.total, lang)}*`;
    const mapLink = mapQ ? `\n🔗 GPS: https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQ)}` : '';
    return (isEn ? `*CARE RESERVATION* | #${hash}\n──────────────────\nHello Thalyson! I'd like to schedule my moment.\n\n👤 *Name:* ${sanitizeInput(user.name)}\n📅 *Date:* ${dateStr} at ${booking.time}\n⏱️ *Duration:* ${f.duration} min\n\n💆‍♂️ *WHAT I CHOSE:*\n${servicesText}\n\n${extrasList ? `*Extras:*\n${extrasList}\n\n` : ''}📍 *WHERE:*\n${locTxt}${mapLink}\n\n${booking.locationType !== 'motel' ? `⚠️ Travel fee (Uber) to be confirmed in chat.\n` : ''}🩺 *Health:* I declare I am 100% healthy.\n\n💰 *INVESTMENT:*\n${prices}\n\n💳 *Payment:* ${booking.payment.toUpperCase()}\n──────────────────\n_I accept the terms and await confirmation._` : `*RESERVA DE CUIDADO* | #${hash}\n──────────────────\nOlá Thalyson! Gostaria de agendar meu momento.\n\n👤 *Nome:* ${sanitizeInput(user.name)}\n📅 *Data:* ${dateStr} às ${booking.time}\n⏱️ *Tempo:* ${f.duration} min\n\n💆‍♂️ *O QUE ESCOLHI:*\n${servicesText}\n\n${extrasList ? `*Extras:*\n${extrasList}\n\n` : ''}📍 *ONDE:*\n${locTxt}${mapLink}\n\n${booking.locationType !== 'motel' ? `⚠️ Taxa de deslocamento (Uber) a confirmar no chat.\n` : ''}🩺 *Saúde:* Declaro estar 100% saudável.\n\n💰 *INVESTIMENTO:*\n${prices}\n\n💳 *Pagamento:* ${booking.payment.toUpperCase()}\n──────────────────\n_Aceito os termos e aguardo confirmação._`).trim();
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
        updatedCoupons.push({ id: `LVL${lvl.level}_${Date.now()}`, val: lvl.reward, title: `🏆 ${lvl.title}`, code: `LVLUP${lvl.level}` });
      }
    });
    if (newXP > 800) {
      const oldL = Math.floor(Math.max(0, user.xp - 800) / 500);
      const newL = Math.floor(Math.max(0, newXP - 800) / 500);
      if (newL > oldL) { leveledUp = true; for (let i = oldL + 1; i <= newL; i++) updatedCoupons.push({ id: `LOOP_${i}_${Date.now()}`, val: DATA.levels[3].reward, title: `🏆 Plenitude Plus`, code: `PLUS${i}` }); }
    }
    setUser(p => ({ ...p, xp: newXP, coupons: updatedCoupons, usedCoupons: updatedHistory, ordersCount: (p.ordersCount || 92) + 1, lastActivity: new Date().toISOString() }));
    if (leveledUp) { setLevelUpPopup(true); setTimeout(() => addToast(T.levelup_popup_title, 'success'), 500); }
    openExternal('whatsapp', generateWhatsAppMsg());
    setStep(4);
  };

  const scrollDates = (dir: 'left' | 'right') => {
    dateScrollRef.current?.scrollBy({ left: dir === 'left' ? -260 : 260, behavior: 'smooth' });
  };

  const getDayLabel = (d: Date) => {
    const today = new Date(); const tmrw = new Date(today); tmrw.setDate(today.getDate() + 1);
    if (d.toDateString() === today.toDateString()) return T.today;
    if (d.toDateString() === tmrw.toDateString()) return T.tomorrow;
    return d.toLocaleDateString(lang === 'en' ? CONFIG.LOCALE_EN : CONFIG.LOCALE_PT, { weekday: 'short' }).slice(0, 3).toUpperCase();
  };

  const nextLevel = getNextLevelInfo();
  const categoryConfig = [
    { id: 'relax', title: lang === 'en' ? "Just Relax" : "Apenas Relaxar", icon: 'sun', desc: lang === 'en' ? "Therapeutic body work to relieve stress." : "Trabalho corporal terapêutico para aliviar o estresse." },
    { id: 'express', title: lang === 'en' ? "Express Care" : "Cuidados Rápidos", icon: 'watch', desc: lang === 'en' ? "Quick localized relief for hands and feet." : "Alívio rápido e localizado nas mãos e pés." },
    { id: 'final', title: lang === 'en' ? "With Ending" : "Com Finalização", icon: 'sparkles', desc: lang === 'en' ? "A complete and intense sensory journey." : "A verdadeira jornada sensorial com prazer intenso." },
    { id: 'care', title: lang === 'en' ? "Personal Care" : "Cuidados Pessoais", icon: 'scissors', desc: lang === 'en' ? "Aesthetic body maintenance." : "Manutenção estética do corpo." },
  ];

  if (!isClient) return <div className="min-h-screen w-full bg-[#080a0f]" />;

  if (loading) {
    return (
      <div className={`fixed inset-0 flex flex-col items-center justify-center z-[100] ${isDark ? 'bg-[#080a0f]' : 'bg-[#f5f4f0]'}`}>
        <div className="flex flex-col items-center max-w-xs w-full px-8">
          <div className="relative mb-10">
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl scale-[1.8] animate-pulse" />
            <div className="relative w-20 h-20 rounded-[2rem] bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-2xl border border-blue-400/20">
              <span className="font-display text-4xl text-white">T</span>
            </div>
          </div>
          <div className="w-full h-[2px] bg-white/6 rounded-full overflow-hidden mb-5">
            <div className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 w-1/2 loading-bar-anim" />
          </div>
          <p className={`text-[10px] uppercase font-semibold tracking-[0.2em] ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}>{T.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <GlobalStyles isDark={isDark} />

      <div className={`fixed inset-0 z-[-1] transition-colors duration-500 ${isDark ? 'bg-[#080a0f]' : 'bg-[#f5f4f0]'}`} />

      {/* Ambient glow */}
      {isDark && (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-600/4 rounded-full blur-[80px]" />
        </div>
      )}

      <ToastContainer toasts={toasts} isDark={isDark} />
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} isDark={isDark} toggleTheme={() => setIsDark(p => !p)} user={user} T={T} />

      <main className={`min-h-screen relative z-10 pb-44 px-4 md:px-6 max-w-4xl mx-auto`}>

        {/* ── HEADER ── */}
        {step !== 4 && (
          <header className="pt-8 pb-6 md:pt-12 md:pb-10">
            <div className="flex items-start justify-between gap-4">
              <button onClick={() => setStep(0)} className="group text-left">
                <h1 className={`font-display text-2xl md:text-3xl leading-none mb-1.5 transition-opacity group-hover:opacity-80 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Thalyson Massagens
                </h1>
                <div className={`flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}>
                  <span className="relative flex h-1.5 w-1.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500" />
                  </span>
                  {lang === 'en' ? `${user.ordersCount}+ ${T.header_tensions}` : `+${user.ordersCount} ${T.header_tensions}`}
                </div>
              </button>

              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => setLang(l => l === 'pt' ? 'en' : 'pt')} className={`relative h-9 w-9 flex items-center justify-center rounded-xl border transition-all ${isDark ? 'border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white' : 'border-black/8 bg-black/4 text-slate-500 hover:text-slate-800'}`}>
                  <Icon name="globe" size={17} />
                  <span className="absolute -bottom-1.5 -right-1.5 text-[7px] font-bold bg-blue-600 text-white px-1 py-0.5 rounded-md leading-none">{lang.toUpperCase()}</span>
                </button>
                <button onClick={() => openExternal('instagram')} className={`h-9 w-9 flex items-center justify-center rounded-xl border transition-all ${isDark ? 'border-white/10 bg-white/5 text-pink-400 hover:bg-white/10' : 'border-black/8 bg-black/4 text-pink-600 hover:text-pink-700'}`}>
                  <Icon name="instagram" size={17} />
                </button>
                <button onClick={() => setMenuOpen(true)} className={`h-9 w-9 flex items-center justify-center rounded-xl border transition-all ${isDark ? 'border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white' : 'border-black/8 bg-black/4 text-slate-500 hover:text-slate-800'}`}>
                  <Icon name="menu" size={17} />
                </button>
              </div>
            </div>

            {/* Step progress */}
            {step > 0 && step < 4 && (
              <div className="mt-8 flex items-center gap-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 cursor-pointer" onClick={() => { if (i < step) setStep(i); }}>
                    <div className={`w-full h-1 rounded-full transition-all duration-500 ${step > i ? 'bg-blue-600' : step === i ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]' : isDark ? 'bg-white/8' : 'bg-black/8'}`} />
                    <span className={`text-[9px] uppercase font-semibold tracking-widest ${step >= i ? isDark ? 'text-white/70' : 'text-slate-600' : isDark ? 'text-white/20' : 'text-slate-300'}`}>
                      {i === 1 ? T.step_where : i === 2 ? T.step_when : T.step_summary}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </header>
        )}

        <div>
          {/* ═══════════════════════════════════════════════════════
              STEP 0 — SERVICE SELECTION
          ═══════════════════════════════════════════════════════ */}
          {step === 0 && (
            <section className="animate-fade-up space-y-14">

              {/* Hero + XP card */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                <div>
                  <h2 className={`font-display text-3xl md:text-5xl leading-[1.1] mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {T.welcome} <span className="italic text-gradient-blue">{user.name ? String(user.name).trim().split(' ')[0] : T.welcome_anon}</span>
                  </h2>
                  <p className={`text-sm md:text-base leading-relaxed max-w-sm ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{T.choose_sub}</p>
                </div>

                {/* XP Level Card */}
                <div className={`p-6 rounded-3xl border relative overflow-hidden ${isDark ? 'bg-white/4 border-white/8' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/6 rounded-full blur-2xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
                  <div className="flex items-start justify-between mb-6 relative">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}>
                        <Icon name="award" size={20} />
                      </div>
                      <div>
                        <p className={`text-[9px] uppercase font-semibold tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{T.level_label}</p>
                        <h3 className={`text-sm font-semibold mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{getCurrentLevelTitle()}</h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-display text-3xl text-gradient-blue">{user.xp}</span>
                      <span className={`text-[9px] uppercase font-bold tracking-widest block ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{T.level_current}</span>
                    </div>
                  </div>

                  <div className="relative">
                    <div className={`flex justify-between text-[9px] uppercase font-semibold tracking-widest mb-2 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                      <span>{T.level_journey}</span>
                      <span>{Math.floor(getCurrentLevelProgress())}%</span>
                    </div>
                    <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-white/6' : 'bg-slate-100'}`}>
                      <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-1000" style={{ width: `${getCurrentLevelProgress()}%` }} />
                    </div>
                    {nextLevel && (
                      <p className={`text-[11px] mt-3 text-center ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                        {T.msg_level_keep1} <strong className={isDark ? 'text-white' : 'text-slate-800'}>{nextLevel.needed} XP</strong> {T.msg_level_keep2} <span className="text-blue-400">{formatMoney(nextLevel.reward, lang)}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Tab switcher */}
              <div className={`flex p-1.5 rounded-2xl border w-fit mx-auto ${isDark ? 'bg-white/4 border-white/8' : 'bg-slate-100 border-slate-200'}`}>
                {[
                  { id: 'single', label: T.tab_single, icon: 'user' },
                  { id: 'packs', label: T.tab_packs, icon: 'package' }
                ].map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-semibold uppercase tracking-wider transition-all duration-300 ${activeTab === tab.id
                      ? tab.id === 'packs' ? 'bg-amber-500 text-zinc-950 shadow-lg' : 'bg-blue-600 text-white shadow-lg'
                      : isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-500 hover:text-slate-700'}`}>
                    <Icon name={tab.icon} size={15} />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="tab-content">
                {activeTab === 'single' ? (
                  <div className="space-y-12">
                    {categoryConfig.map(cat => {
                      const services = DATA.services.filter((s: ServiceItem) => s.category === cat.id);
                      if (!services.length) return null;
                      const cfg = CATEGORY_CONFIG[cat.id];
                      return (
                        <div key={cat.id} className="rounded-[2rem] overflow-hidden border" style={{ borderColor: cfg.borderColor, background: isDark ? cfg.bg : cfg.lightBg }}>
                          {/* Category header */}
                          <div className="px-6 py-5 flex items-center gap-4 border-b" style={{ borderColor: cfg.borderColor }}>
                            <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${cfg.color}20`, border: `1px solid ${cfg.color}30` }}>
                              <Icon name={cat.icon} size={22} style={{ color: cfg.color }} />
                            </div>
                            <div>
                              <h3 className={`font-display text-xl leading-none mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{cat.title}</h3>
                              <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{cat.desc}</p>
                            </div>
                            {booking.cart.filter(c => c.category === cat.id).length > 0 && (
                              <div className="ml-auto shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: cfg.color }}>
                                {booking.cart.filter(c => c.category === cat.id).length}
                              </div>
                            )}
                          </div>

                          {/* Services grid */}
                          <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {services.map((s: ServiceItem) => (
                              <ServiceCard key={s.id} service={s} isInCart={booking.cart.some(c => c.id === s.id)} onToggle={handleToggleCartItem} isDark={isDark} T={T} />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {DATA.plans.map((s: ServiceItem) => {
                      const isInCart = booking.cart.some(c => c.id === s.id);
                      return (
                        <div key={s.id} className={`relative rounded-3xl border transition-all duration-300 overflow-hidden card-hover cursor-pointer ${isInCart ? 'service-card-selected-amber border-amber-500/70 bg-amber-500/6' : isDark ? 'bg-white/4 border-white/8 hover:border-amber-500/30 hover:bg-amber-500/4' : 'bg-white border-slate-200 hover:border-amber-300 shadow-sm hover:shadow-md'}`}
                          onClick={() => handleToggleCartItem(s)}>
                          {isInCart && (
                            <div className="absolute top-4 right-4 z-10 w-6 h-6 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center animate-check-pop">
                              <Icon name="check" size={13} />
                            </div>
                          )}
                          <div className="p-6">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 border ${isDark ? 'bg-amber-500/15 border-amber-500/25 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-600'}`}>
                              <Icon name={s.icon} size={20} />
                            </div>
                            <span className={`text-[9px] font-semibold uppercase tracking-widest border px-2.5 py-1 rounded-full block w-fit mb-3 ${isDark ? 'bg-amber-500/10 border-amber-500/25 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>{s.tag}</span>
                            <h3 className={`font-display text-lg leading-snug mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{s.title}</h3>
                            <p className={`text-xs leading-relaxed mb-5 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{s.desc}</p>

                            <div className="flex items-end justify-between border-t pt-4" style={{ borderColor: isDark ? 'rgba(245,158,11,0.2)' : 'rgba(245,158,11,0.15)' }}>
                              <div>
                                {s.fullPrice && <p className={`text-[10px] line-through mb-0.5 ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}>{T.from} {formatMoney(s.fullPrice, 'pt')}</p>}
                                <p className={`font-display text-2xl ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatMoney(s.price, 'pt')}</p>
                              </div>
                              {s.savings && (
                                <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${isDark ? 'bg-emerald-500/15 border-emerald-500/25 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
                                  {T.savings} {formatMoney(s.savings, 'pt')}
                                </span>
                              )}
                            </div>

                            <div className="mt-4 space-y-1.5">
                              {s.details.split('\n').map((line: string, i: number) => (
                                <div key={i} className="flex items-start gap-2">
                                  <span className={`text-[10px] font-bold mt-0.5 shrink-0 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>→</span>
                                  <span className={`text-[11px] leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{line}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Reviews */}
              <div className="py-10 border-t border-b" style={{ borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)' }}>
                <div className="flex items-center justify-between mb-7">
                  <h3 className={`font-display text-2xl ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.reviews_title}</h3>
                  <div className="hidden md:flex gap-2">
                    {['chevron-left', 'chevron-right'].map((dir, i) => (
                      <button key={dir} onClick={() => reviewScrollRef.current?.scrollBy({ left: i === 0 ? -340 : 340, behavior: 'smooth' })}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all hover:-translate-y-0.5 ${isDark ? 'border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10' : 'border-slate-200 bg-white text-slate-500 hover:text-slate-900 shadow-sm'}`}>
                        <Icon name={dir} size={17} />
                      </button>
                    ))}
                  </div>
                </div>
                <div ref={reviewScrollRef} className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 pb-4 -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
                  {DATA.reviews.map((r: Review, i: number) => (
                    <div key={i} className="snap-center shrink-0 w-[80vw] sm:w-72 md:w-80 h-auto">
                      <ReviewCard review={r} isDark={isDark} />
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ */}
              <div className="max-w-2xl mx-auto pb-4">
                <h3 className={`font-display text-2xl text-center mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.faq_title}</h3>
                <div className={`rounded-3xl border overflow-hidden ${isDark ? 'bg-white/3 border-white/8' : 'bg-white border-slate-200'}`}>
                  <div className="px-6 divide-y" style={{ borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)' }}>
                    {DATA.faq.map((item: any, idx: number) => <FAQItem key={idx} q={item.q} a={item.a} isDark={isDark} />)}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════
              STEP 1 — WHERE
          ═══════════════════════════════════════════════════════ */}
          {step === 1 && (
            <section className="animate-fade-up max-w-xl mx-auto space-y-8">
              <div className="text-center">
                <h2 className={`font-display text-3xl md:text-4xl mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.location_title}</h2>
                <p className={`text-sm ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{lang === 'en' ? 'I come to you' : 'Eu vou até você'}</p>
              </div>

              {/* Location type */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'home', label: T.loc_home, icon: 'home', desc: lang === 'en' ? 'Your place' : 'Sua casa' },
                  { id: 'motel', label: T.loc_motel, icon: 'bed', desc: lang === 'en' ? 'Private suite' : 'Suíte privada' },
                  { id: 'hotel', label: T.loc_hotel, icon: 'building', desc: lang === 'en' ? 'Your hotel' : 'Seu hotel' }
                ].map(x => (
                  <button key={x.id} onClick={() => setBooking(b => ({ ...b, locationType: x.id as any }))}
                    className={`py-5 px-2 rounded-2xl flex flex-col items-center gap-2 transition-all duration-300 border ${booking.locationType === x.id
                      ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/30'
                      : isDark ? 'bg-white/4 border-white/8 text-zinc-400 hover:bg-white/8 hover:text-white hover:border-white/14' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 shadow-sm'}`}>
                    <Icon name={x.icon} size={22} />
                    <span className="text-[10px] font-semibold uppercase tracking-wider">{x.label}</span>
                    <span className={`text-[9px] ${booking.locationType === x.id ? 'text-blue-200' : isDark ? 'text-zinc-600' : 'text-slate-400'}`}>{x.desc}</span>
                  </button>
                ))}
              </div>

              {/* Form */}
              <div className={`p-6 rounded-3xl border space-y-5 ${isDark ? 'bg-white/4 border-white/8' : 'bg-white border-slate-200 shadow-sm'}`}>
                <InputField isDark={isDark} label={T.input_name} value={user.name}
                  onChange={(e: any) => setUser(u => ({ ...u, name: sanitizeInput(e.target.value) }))}
                  icon="user" placeholder={lang === 'en' ? "Your name" : "Seu nome"}
                  hasError={hasErrorGlobal && (!user.name || String(user.name).trim().length < 3)} />

                {booking.locationType === 'home' && (
                  <div className="space-y-4 animate-fade-up">
                    <InputField isDark={isDark} label={T.input_cep} value={booking.address.cep || ''}
                      onChange={handleCepChange}
                      icon="map-pin" placeholder="00000-000" type="tel" maxLength={9}
                      disabled={isFetchingCep}
                      hasError={hasErrorGlobal && !booking.address.street} />

                    <div className="grid grid-cols-[1fr_88px] gap-3">
                      <InputField isDark={isDark} label={T.input_addr} value={booking.address.street}
                        onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, street: sanitizeInput(e.target.value) } }))}
                        placeholder={lang === 'en' ? "Street / Avenue" : "Rua / Avenida"}
                        disabled={isFetchingCep}
                        hasError={hasErrorGlobal && !booking.address.street} />
                      <InputField isDark={isDark} label={T.input_num} value={booking.address.number}
                        onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, number: sanitizeInput(e.target.value) } }))}
                        placeholder="Nº" type="tel"
                        hasError={hasErrorGlobal && !booking.address.number} />
                    </div>
                    <InputField isDark={isDark} label={T.input_district} value={booking.address.district}
                      onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, district: sanitizeInput(e.target.value) } }))}
                      placeholder={lang === 'en' ? "Neighborhood" : "Bairro"}
                      disabled={isFetchingCep}
                      hasError={hasErrorGlobal && !booking.address.district} />
                    <div className="grid grid-cols-2 gap-3">
                      <InputField isDark={isDark} label={T.input_city} value={booking.address.city}
                        onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, city: sanitizeInput(e.target.value) } }))}
                        placeholder={lang === 'en' ? "City" : "Cidade"}
                        disabled={isFetchingCep}
                        hasError={hasErrorGlobal && !booking.address.city} />
                      <InputField isDark={isDark} label={T.input_comp} value={booking.address.comp}
                        onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, comp: sanitizeInput(e.target.value) } }))}
                        placeholder={lang === 'en' ? "Apt (Optional)" : "Apto (Opcional)"} />
                    </div>
                  </div>
                )}

                {booking.locationType === 'hotel' && (
                  <div className="space-y-4 animate-fade-up">
                    <InputField isDark={isDark} label={T.input_hotel} value={booking.address.placeName}
                      onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, placeName: sanitizeInput(e.target.value) } }))}
                      icon="building" placeholder={lang === 'en' ? "Hotel name" : "Nome do Hotel"} hasError={hasErrorGlobal && !booking.address.placeName} />
                    <div className="grid grid-cols-2 gap-3">
                      <InputField isDark={isDark} label={T.input_city} value={booking.address.city}
                        onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, city: sanitizeInput(e.target.value) } }))}
                        placeholder={lang === 'en' ? "City" : "Cidade"} hasError={hasErrorGlobal && !booking.address.city} />
                      <InputField isDark={isDark} label={T.input_room} value={booking.address.comp}
                        onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, comp: sanitizeInput(e.target.value) } }))}
                        placeholder={lang === 'en' ? "Room Nº" : "Nº Quarto"} />
                    </div>
                  </div>
                )}

                {booking.locationType === 'motel' && (
                  <div className={`p-5 rounded-2xl border flex items-start gap-4 animate-fade-up ${isDark ? 'bg-white/4 border-white/8' : 'bg-slate-50 border-slate-200'}`}>
                    <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-pink-500/15 text-pink-400' : 'bg-pink-50 text-pink-600'}`}>
                      <Icon name="heart" size={20} />
                    </div>
                    <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>{T.motel_note}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════
              STEP 2 — WHEN
          ═══════════════════════════════════════════════════════ */}
          {step === 2 && (
            <section className="animate-fade-up max-w-2xl mx-auto space-y-8">
              <div className="text-center">
                <h2 className={`font-display text-3xl md:text-4xl mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.select_time_title}</h2>
              </div>

              {/* Cart mini summary */}
              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-white/4 border-white/8' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] uppercase font-semibold tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{T.cart_title}</span>
                  <button onClick={() => setStep(0)} className={`text-[10px] uppercase font-semibold tracking-wider px-3 py-1 rounded-lg border transition-colors ${isDark ? 'border-white/10 text-zinc-400 hover:text-white hover:bg-white/8' : 'border-slate-200 text-slate-500 hover:text-slate-800'}`}>{T.cart_edit}</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {booking.cart.map(item => (
                    <span key={item.id} className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl border ${isDark ? 'bg-blue-500/10 border-blue-500/25 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
                      <Icon name={item.icon} size={13} isEmoji={item.isEmoji} />
                      {item.title.split(' ').slice(0, 2).join(' ')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Date scroll */}
              <div className="relative">
                <button onClick={() => scrollDates('left')} className={`hidden md:flex absolute -left-10 top-1/2 -translate-y-1/2 z-20 w-9 h-9 items-center justify-center rounded-xl border transition-all ${isDark ? 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 shadow-sm'}`}><Icon name="chevron-left" size={18} /></button>
                <div ref={dateScrollRef} className="flex gap-2.5 overflow-x-auto snap-x px-1 py-3 scrollbar-hide">
                  {daysArray.map((d, idx) => {
                    const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                    const mo = d.toLocaleDateString(lang === 'en' ? CONFIG.LOCALE_EN : CONFIG.LOCALE_PT, { month: 'short' }).replace('.', '');
                    return (
                      <button key={idx} onClick={() => { setBooking(b => ({ ...b, date: d.toISOString(), time: null })); vibrate(30); }}
                        className={`snap-center shrink-0 w-[64px] h-[88px] rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-300 border ${isSel ? 'bg-blue-600 border-blue-400 text-white scale-[1.06] shadow-lg shadow-blue-900/30' : isDark ? 'bg-white/4 border-white/8 text-zinc-400 hover:bg-white/8 hover:text-white hover:border-white/14' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 shadow-sm'}`}>
                        <span className={`text-[8px] uppercase font-semibold tracking-wider ${isSel ? 'text-blue-200' : ''}`}>{mo}</span>
                        <span className={`font-display text-2xl leading-none ${isSel ? 'text-white' : isDark ? 'text-white' : 'text-slate-800'}`}>{d.getDate()}</span>
                        <span className={`text-[8px] uppercase font-semibold tracking-wider ${isSel ? 'text-blue-200' : ''}`}>{getDayLabel(d)}</span>
                      </button>
                    );
                  })}
                </div>
                <button onClick={() => scrollDates('right')} className={`hidden md:flex absolute -right-10 top-1/2 -translate-y-1/2 z-20 w-9 h-9 items-center justify-center rounded-xl border transition-all ${isDark ? 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 shadow-sm'}`}><Icon name="chevron-right" size={18} /></button>
              </div>

              {/* No date selected */}
              {!booking.date && (
                <div className={`text-center py-16 rounded-3xl border border-dashed flex flex-col items-center gap-3 ${hasErrorGlobal ? 'animate-shake' : ''} ${isDark ? 'border-white/10 text-zinc-600' : 'border-slate-300 text-slate-400'}`}>
                  <Icon name="calendar" size={32} className="opacity-40" />
                  <p className="text-xs font-medium uppercase tracking-widest">{T.empty_date}</p>
                </div>
              )}

              {/* Time slots grouped by period */}
              {booking.date && generateTimeSlots.length > 0 && (
                <div className={`space-y-5 animate-fade-up ${hasErrorGlobal && !booking.time ? 'animate-shake' : ''}`}>
                  {[
                    { key: 'morning', label: T.morning, icon: 'sunrise', slots: groupedTimeSlots.morning },
                    { key: 'afternoon', label: T.afternoon, icon: 'sun', slots: groupedTimeSlots.afternoon },
                    { key: 'evening', label: T.evening, icon: 'sunset', slots: groupedTimeSlots.evening },
                  ].filter(g => g.slots.length > 0).map(group => (
                    <div key={group.key}>
                      <div className={`flex items-center gap-2 mb-3 text-[10px] uppercase font-semibold tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                        <Icon name={group.icon} size={13} />
                        {group.label}
                      </div>
                      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                        {group.slots.map(t => {
                          const isRush = RUSH_HOURS.includes(t) && booking.locationType !== 'motel';
                          const isSel = booking.time === t;
                          return (
                            <button key={t} onClick={() => { setBooking(b => ({ ...b, time: t })); vibrate(30); }}
                              className={`relative flex flex-col items-center justify-center py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 ${isSel
                                ? isRush ? 'bg-amber-500 border-amber-400 text-zinc-950 scale-105 shadow-md' : 'bg-blue-600 border-blue-400 text-white scale-105 shadow-md shadow-blue-900/30'
                                : isDark
                                  ? isRush ? 'bg-amber-500/8 border-amber-500/20 text-amber-400 hover:bg-amber-500/15' : 'bg-white/5 border-white/8 text-zinc-300 hover:bg-white/10 hover:border-white/14'
                                  : isRush ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 shadow-sm'}`}>
                              {t}
                              {isRush && <span className={`text-[7px] uppercase tracking-wide mt-0.5 ${isSel ? 'text-amber-900/70' : isDark ? 'text-amber-500' : 'text-amber-600'}`}>+{formatMoney(RUSH_FEE, lang).replace('R$ ', 'R$')}</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Rush notice */}
                  {Object.values(groupedTimeSlots).flat().some(t => RUSH_HOURS.includes(t)) && booking.locationType !== 'motel' && (
                    <div className={`flex items-start gap-3 p-4 rounded-xl border text-xs leading-relaxed ${isDark ? 'bg-amber-500/8 border-amber-500/20 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                      <Icon name="alert-circle" size={15} className="shrink-0 mt-0.5" />
                      <p>{lang === 'en' ? 'Rush hour slots (noon/late afternoon) include a small R$ 15 displacement fee.' : 'Horários de pico (meio-dia/fim de tarde) incluem uma pequena taxa de R$ 15 de deslocamento.'}</p>
                    </div>
                  )}
                </div>
              )}

              {booking.date && generateTimeSlots.length === 0 && (
                <div className={`text-center py-14 rounded-3xl border ${isDark ? 'border-white/8 text-zinc-500' : 'border-slate-200 text-slate-400'}`}>
                  <p className="text-sm font-medium">{T.empty_slots}</p>
                </div>
              )}
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════
              STEP 3 — SUMMARY & PAYMENT
          ═══════════════════════════════════════════════════════ */}
          {step === 3 && (
            <section className="animate-fade-up space-y-6 max-w-4xl mx-auto">
              <SmartTimer isDark={isDark} text={T.timer_text} />

              {/* Extras */}
              <div className={`p-6 rounded-3xl border ${isDark ? 'bg-white/4 border-white/8' : 'bg-white border-slate-200 shadow-sm'}`}>
                <h3 className={`font-display text-xl mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.extras_title}</h3>
                <p className={`text-xs mb-5 ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{lang === 'en' ? 'Optional add-ons for your experience.' : 'Complementos opcionais para sua experiência.'}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {DATA.extras.map((ex: any) => {
                    const price = booking.cart.some(i => i.type === 'pack') ? Math.floor(ex.price * 0.8) : ex.price;
                    const isActive = booking.extras[ex.id];
                    return (
                      <div key={ex.id} onClick={() => { setBooking(b => ({ ...b, extras: { ...b.extras, [ex.id]: !b.extras[ex.id] } })); vibrate(30); }}
                        role="checkbox" aria-checked={isActive}
                        className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${isActive ? 'bg-blue-600/12 border-blue-500/50' : isDark ? 'bg-white/3 border-white/8 hover:bg-white/6 hover:border-white/14' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}>
                        <div className="flex items-center gap-3 min-w-0 pr-3">
                          <span style={{ fontSize: 20 }}>{ex.icon}</span>
                          <div className="min-w-0">
                            <p className={`text-sm font-medium truncate ${isActive ? isDark ? 'text-blue-300' : 'text-blue-700' : isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{ex.label}</p>
                            <p className={`text-[11px] truncate ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}>{ex.desc}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold tracking-wide px-2.5 py-1.5 rounded-xl whitespace-nowrap shrink-0 transition-colors ${isActive ? 'bg-blue-600 text-white' : isDark ? 'bg-white/8 text-zinc-300' : 'bg-slate-200 text-slate-600'}`}>
                          +{formatMoney(price, lang)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Main grid: summary + right column */}
              <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">

                {/* Order summary */}
                <div className={`p-6 rounded-3xl border ${isDark ? 'bg-white/4 border-white/8' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <h3 className={`font-display text-xl mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <Icon name="file-text" size={20} className={isDark ? 'text-zinc-500' : 'text-slate-400'} />
                    {T.summary_title}
                  </h3>

                  <div className="space-y-5">
                    {/* Services */}
                    <div>
                      <p className={`text-[9px] uppercase font-semibold tracking-widest mb-3 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{T.summary_items}</p>
                      <div className="space-y-2.5">
                        {booking.cart.map((item, i) => (
                          <div key={i} className={`flex justify-between items-center text-sm border-b pb-2.5 last:border-0 last:pb-0 ${isDark ? 'border-white/6' : 'border-slate-100'}`}>
                            <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</span>
                            <span className={isDark ? 'text-zinc-400' : 'text-slate-600'}>{formatMoney(item.price, lang)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Extras */}
                    {Object.keys(booking.extras || {}).filter(k => booking.extras[k]).length > 0 && (
                      <div className={`border-t pt-4 ${isDark ? 'border-white/6' : 'border-slate-100'}`}>
                        <p className={`text-[9px] uppercase font-semibold tracking-widest mb-3 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{T.summary_extras}</p>
                        {Object.keys(booking.extras || {}).filter(k => booking.extras[k]).map(k => {
                          const ex = DATA.extras.find((e: any) => e.id === k);
                          if (!ex) return null;
                          const price = booking.cart.some(i => i.type === 'pack') ? Math.floor(ex.price * 0.8) : ex.price;
                          return (
                            <div key={k} className={`flex justify-between text-sm mb-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                              <span>{ex.label}</span>
                              <span>+{formatMoney(price, lang)}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Session info */}
                    <div className={`border-t pt-4 ${isDark ? 'border-white/6' : 'border-slate-100'}`}>
                      <p className={`text-[9px] uppercase font-semibold tracking-widest mb-3 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{T.summary_info}</p>
                      <div className="space-y-1.5 text-sm">
                        <div className={`flex items-center gap-2.5 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                          <Icon name="calendar" size={14} className="text-blue-500 shrink-0" />
                          {booking.date ? new Date(booking.date).toLocaleDateString(lang === 'en' ? CONFIG.LOCALE_EN : CONFIG.LOCALE_PT) : ''} {lang === 'en' ? 'at' : 'às'} {booking.time}
                        </div>
                        <div className={`flex items-center gap-2.5 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                          <Icon name="map-pin" size={14} className="text-blue-500 shrink-0" />
                          {booking.locationType === 'home' ? T.summary_loc_home : booking.locationType === 'motel' ? T.summary_loc_motel : T.summary_loc_hotel}
                        </div>
                        <div className={`flex items-center gap-2.5 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                          <Icon name="clock" size={14} className="text-blue-500 shrink-0" />
                          {financials.duration} min
                        </div>
                      </div>
                    </div>

                    {/* Price breakdown */}
                    <div className={`border-t pt-4 space-y-2 ${isDark ? 'border-white/8' : 'border-slate-200'}`}>
                      <div className={`flex justify-between text-sm ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                        <span>{T.subtotal}</span>
                        <span>{formatMoney(financials.sub, lang)}</span>
                      </div>
                      {booking.appliedCoupon && (
                        <div className={`flex justify-between text-sm ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                          <span className="flex items-center gap-1.5"><Icon name="gift" size={13} />{booking.appliedCoupon.code}</span>
                          <span>-{formatMoney(financials.disc, lang)}</span>
                        </div>
                      )}
                      {financials.mediaDisc > 0 && (
                        <div className={`flex justify-between text-sm ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                          <span>{T.media_discount}</span>
                          <span>-{formatMoney(financials.mediaDisc, lang)}</span>
                        </div>
                      )}
                      {financials.pixDisc > 0 && (
                        <div className={`flex justify-between text-sm ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                          <span>{T.pix_discount}</span>
                          <span>-{formatMoney(financials.pixDisc, lang)}</span>
                        </div>
                      )}
                      {financials.rushFee > 0 && (
                        <div className={`flex justify-between text-sm ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                          <span className="flex items-center gap-1.5"><Icon name="car" size={13} />{T.msg_rush_fee}</span>
                          <span>+{formatMoney(financials.rushFee, lang)}</span>
                        </div>
                      )}

                      <div className={`flex justify-between items-end pt-3 border-t ${isDark ? 'border-white/8' : 'border-slate-100'}`}>
                        <span className={`text-xs uppercase font-semibold tracking-widest ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.total_label}</span>
                        <div className="text-right">
                          <p className="font-display text-3xl text-gradient-blue">{formatMoney(financials.total, lang)}</p>
                          <p className={`text-[9px] uppercase font-semibold tracking-widest mt-0.5 flex items-center justify-end gap-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                            <Icon name="sparkles" size={9} /> +{estimatedXP} {T.xp_guaranteed}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Uber notice */}
                    {booking.locationType !== 'motel' && (
                      <div className={`flex items-start gap-3 p-3 rounded-xl text-[11px] leading-relaxed border ${isDark ? 'bg-white/4 border-white/8 text-zinc-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                        <Icon name="car" size={14} className="shrink-0 mt-0.5" />
                        {T.uber_notice}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right column */}
                <div className="space-y-5">
                  {/* Coupon section */}
                  <div className={`p-5 rounded-3xl border ${isDark ? 'bg-white/4 border-white/8' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <h4 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      <Icon name="ticket" size={16} className={isDark ? 'text-zinc-500' : 'text-slate-400'} />
                      {T.coupon_section}
                    </h4>

                    {/* Saved coupons */}
                    {user.coupons.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {user.coupons.map(c => (
                          <button key={c.id} onClick={() => { setBooking(b => ({ ...b, appliedCoupon: b.appliedCoupon?.id === c.id ? null : c })); vibrate(30); }}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all flex items-center gap-1.5 ${booking.appliedCoupon?.id === c.id ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-900/20' : isDark ? 'bg-white/6 border-white/10 text-zinc-300 hover:bg-white/10' : 'bg-slate-100 border-slate-200 text-slate-700 hover:border-slate-300'}`}>
                            {booking.appliedCoupon?.id === c.id && <Icon name="check" size={11} />}
                            {c.code}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Manual coupon input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={e => setCouponInput(e.target.value.toUpperCase())}
                        onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                        placeholder={T.coupon_placeholder}
                        className={`input-field flex-1 h-10 px-3 rounded-xl text-xs font-medium border outline-none tracking-widest uppercase ${isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus:border-blue-500/60' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500'}`}
                      />
                      <button onClick={handleApplyCoupon}
                        className={`h-10 px-4 rounded-xl text-xs font-semibold uppercase tracking-wide transition-all border ${isDark ? 'bg-white/8 border-white/12 text-zinc-300 hover:bg-white/14 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'}`}>
                        {T.coupon_apply}
                      </button>
                    </div>
                  </div>

                  {/* Portfolio */}
                  <div className={`p-5 rounded-3xl border ${isDark ? 'bg-white/4 border-white/8' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isDark ? 'bg-white/8 text-zinc-400' : 'bg-slate-100 text-slate-500'}`}>
                        <Icon name="camera" size={17} />
                      </div>
                      <div>
                        <h4 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.media_title}</h4>
                        <p className={`text-[11px] mt-0.5 leading-relaxed ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{T.media_desc}</p>
                      </div>
                    </div>
                    <button onClick={() => { setBooking(b => ({ ...b, mediaAllowed: !b.mediaAllowed })); vibrate(30); }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-[10px] font-semibold uppercase tracking-widest ${booking.mediaAllowed ? 'bg-blue-600/15 border-blue-500/50 text-blue-400' : isDark ? 'bg-white/4 border-white/10 text-zinc-500 hover:bg-white/8 hover:text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                      <span>{booking.mediaAllowed ? T.media_granted : T.media_support}</span>
                      <span className={`px-2 py-0.5 rounded-lg ${booking.mediaAllowed ? 'bg-blue-600 text-white' : isDark ? 'bg-white/8' : 'bg-slate-100'}`}>{T.media_bonus}</span>
                    </button>
                  </div>

                  {/* Payment */}
                  <div className={`p-5 rounded-3xl border ${hasErrorGlobal && !booking.payment ? 'animate-shake' : ''} ${isDark ? 'bg-white/4 border-white/8' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <h4 className={`text-sm font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.payment_title}</h4>
                    <div className="space-y-2.5">
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
                          className={`w-full flex items-center gap-3 p-3.5 h-14 rounded-2xl border transition-all duration-200 ${booking.payment === p.id ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/20' : isDark ? 'bg-white/4 border-white/8 text-zinc-300 hover:bg-white/8 hover:border-white/14' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'}`}>
                          <Icon name={p.icon} size={18} className="shrink-0" />
                          <span className="flex-1 text-left text-xs font-semibold tracking-wide">{p.label}</span>
                          {p.id === 'pix' && booking.payment === 'pix' && (
                            <span className="text-[9px] font-bold bg-white/20 px-2 py-0.5 rounded-lg">{p.note}</span>
                          )}
                          <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${booking.payment === p.id ? 'border-white' : isDark ? 'border-white/20' : 'border-slate-300'}`}>
                            {booking.payment === p.id && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Terms */}
                  <div className={hasErrorGlobal && !booking.termsAccepted ? 'animate-shake' : ''}>
                    <button onClick={() => setTermsOpen(true)}
                      className={`w-full flex items-center justify-between p-5 rounded-3xl border cursor-pointer transition-all duration-300 ${booking.termsAccepted ? isDark ? 'bg-emerald-600/15 border-emerald-500/50' : 'bg-emerald-50 border-emerald-300' : isDark ? 'bg-white/4 border-white/8 hover:bg-white/8 hover:border-white/14' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'}`}>
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${booking.termsAccepted ? isDark ? 'bg-emerald-600/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600' : isDark ? 'bg-white/8 text-zinc-400' : 'bg-slate-100 text-slate-500'}`}>
                          <Icon name="heart" size={18} />
                        </div>
                        <div className="min-w-0 text-left">
                          <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.terms_title}</p>
                          <p className={`text-[10px] mt-0.5 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{T.terms_read}</p>
                        </div>
                      </div>
                      <div onClick={e => { e.stopPropagation(); vibrate(30); setBooking(b => ({ ...b, termsAccepted: !b.termsAccepted })); }}
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${booking.termsAccepted ? 'bg-emerald-600 border-emerald-500 text-white shadow-md' : isDark ? 'border-white/20' : 'border-slate-300'}`}>
                        {booking.termsAccepted && <Icon name="check" size={14} />}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════
              STEP 4 — SUCCESS
          ═══════════════════════════════════════════════════════ */}
          {step === 4 && (
            <section className="min-h-[80vh] flex flex-col items-center justify-center text-center animate-scale-in max-w-sm mx-auto px-4 pt-10">
              {/* Success animation */}
              <div className="relative mb-10">
                <div className="absolute inset-0 rounded-full animate-ping" style={{ background: 'rgba(16,185,129,0.2)', animationDuration: '1.8s' }} />
                <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 60px 20px rgba(16,185,129,0.15)' }} />
                <div className={`relative w-24 h-24 rounded-full flex items-center justify-center border-2 border-emerald-500/50 ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                  <Icon name="check" size={40} className="text-emerald-400" />
                </div>
              </div>

              <h2 className={`font-display text-4xl mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.success_title}</h2>
              <p className={`text-sm leading-relaxed mb-8 max-w-xs ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{T.success_sub}</p>

              {/* Booking details card */}
              <div className={`w-full p-5 rounded-3xl border mb-8 text-left space-y-2 ${isDark ? 'bg-white/4 border-white/8' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className={`flex items-center gap-2.5 text-sm ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                  <Icon name="user" size={15} className="text-blue-400 shrink-0" />
                  {user.name}
                </div>
                <div className={`flex items-center gap-2.5 text-sm ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                  <Icon name="calendar" size={15} className="text-blue-400 shrink-0" />
                  {booking.date ? new Date(booking.date).toLocaleDateString(lang === 'en' ? CONFIG.LOCALE_EN : CONFIG.LOCALE_PT) : ''} {lang === 'en' ? 'at' : 'às'} {booking.time}
                </div>
                <div className={`flex items-center justify-between text-sm pt-2 border-t ${isDark ? 'border-white/6 text-white' : 'border-slate-100 text-slate-900'}`}>
                  <span className="font-semibold">{T.total_label}</span>
                  <span className="font-display text-xl text-gradient-blue">{formatMoney(financials.total, lang)}</span>
                </div>
              </div>

              <div className="w-full space-y-3">
                <Button variant="whatsapp" size="lg" full icon="message" onClick={() => openExternal('whatsapp', generateWhatsAppMsg())}>
                  {T.whatsapp_btn}
                </Button>
                <button onClick={() => { setStep(0); setBooking({ ...booking, cart: [], termsAccepted: false, appliedCoupon: null, bookingId: `BOOK_${Date.now()}`, mediaAllowed: false }); }}
                  className={`w-full text-xs font-semibold uppercase tracking-widest py-3 transition-colors ${isDark ? 'text-zinc-600 hover:text-zinc-400' : 'text-slate-400 hover:text-slate-600'}`}>
                  {T.back_home}
                </button>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* ── STICKY BOTTOM NAV ── */}
      {step >= 0 && step < 4 && booking.cart.length > 0 && (
        <nav className="fixed bottom-0 inset-x-0 px-4 pb-4 pt-2 z-40 animate-slide-up pointer-events-none">
          <div className={`max-w-4xl mx-auto glass-strong pointer-events-auto rounded-[2rem] overflow-hidden border shadow-2xl ${isDark ? 'shadow-black/70 border-white/10' : 'shadow-slate-300/80 border-black/8'}`}>
            <div className="flex items-center gap-3 px-4 py-3">
              {/* Back btn */}
              {step > 0 && (
                <button onClick={() => { setStep(s => s - 1); vibrate(30); }}
                  className={`w-12 h-12 flex items-center justify-center rounded-xl border transition-all shrink-0 ${isDark ? 'border-white/10 bg-white/6 text-zinc-400 hover:text-white hover:bg-white/12' : 'border-slate-200 bg-slate-100 text-slate-500 hover:text-slate-800'}`}>
                  <Icon name="chevron-left" size={20} />
                </button>
              )}

              {/* Price info */}
              <div className={`flex-1 min-w-0 pl-${step === 0 ? '3' : '1'}`}>
                <p className={`text-[9px] uppercase font-semibold tracking-widest mb-0.5 ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}>
                  {step === 0 ? `${booking.cart.length} ${T.items_selected}` : step === 3 ? T.total_label : T.subtotal}
                </p>
                <p className={`font-display text-2xl leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {step === 3 ? formatMoney(financials.total, lang) : formatMoney(financials.sub, lang)}
                </p>
              </div>

              {/* Primary CTA */}
              <button onClick={handleNextStep}
                className={`relative h-12 flex items-center gap-2 px-6 rounded-xl font-semibold text-xs uppercase tracking-wide transition-all duration-200 shrink-0 overflow-hidden ${isStepValid()
                  ? step === 3
                    ? 'bg-[#25D366] text-white hover:bg-[#22c55e] shadow-lg shadow-green-900/30 hover:-translate-y-0.5 active:scale-95'
                    : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/25 hover:-translate-y-0.5 active:scale-95'
                  : isDark ? 'bg-white/8 border border-white/10 text-zinc-600' : 'bg-slate-100 border border-slate-200 text-slate-400'}`}>
                {step === 3 ? (
                  <><Icon name="message" size={16} /><span className="hidden sm:inline">{T.finish_btn}</span><span className="sm:hidden">{T.btn_finish_short}</span></>
                ) : (
                  <><span className="hidden sm:inline">{T.next_btn}</span><span className="sm:hidden">{T.btn_next_short}</span><Icon name="chevron-right" size={16} /></>
                )}
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* ── TERMS MODAL ── */}
      {termsOpen && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className={`relative w-full max-w-lg max-h-[85vh] rounded-[2rem] flex flex-col border shadow-2xl animate-slide-up ${isDark ? 'bg-[#0d0f16] border-white/10' : 'bg-white border-slate-200'}`}>
            <div className={`flex items-center justify-between p-6 border-b shrink-0 ${isDark ? 'border-white/8' : 'border-slate-100'}`}>
              <h3 className={`font-display text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.rules_complete}</h3>
              <button onClick={() => setTermsOpen(false)} className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${isDark ? 'text-zinc-500 hover:text-white hover:bg-white/8' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`}>
                <Icon name="x" size={18} />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-6 space-y-2">
              {DATA.rules.map((rule: Rule, i: number) => <RuleItem key={i} rule={rule} isDark={isDark} />)}
            </div>
            <div className={`p-5 border-t shrink-0 ${isDark ? 'border-white/8' : 'border-slate-100'}`}>
              <Button full size="lg" onClick={() => { setBooking(b => ({ ...b, termsAccepted: true })); vibrate(30); setTermsOpen(false); }}>{T.agree_terms}</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── WELCOME POPUP ── */}
      {welcomePopup && (
        <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className={`relative w-full max-w-sm rounded-[2rem] p-7 border shadow-2xl animate-scale-in overflow-hidden ${isDark ? 'bg-[#0d0f16] border-white/10' : 'bg-white border-slate-200'}`}>
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/6 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${isDark ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' : 'bg-blue-50 text-blue-600 border border-blue-200'}`}>
              <Icon name="gift" size={26} />
            </div>
            <h3 className={`font-display text-2xl mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.welcome_popup_title}</h3>
            <p className={`text-sm leading-relaxed mb-4 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{T.welcome_popup_msg}</p>

            <div className={`text-[10px] p-3 rounded-xl border mb-5 ${isDark ? 'bg-amber-500/8 border-amber-500/20 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
              {T.welcome_popup_warning}
            </div>

            <div className={`p-4 rounded-2xl border border-dashed mb-5 text-center ${isDark ? 'border-blue-500/30 bg-blue-500/6' : 'border-blue-200 bg-blue-50/50'}`}>
              <p className={`text-[9px] uppercase font-semibold tracking-widest mb-1.5 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{lang === 'en' ? 'Your first gift' : 'Seu presente inaugural'}</p>
              <p className={`font-display text-3xl tracking-widest ${isDark ? 'text-white' : 'text-slate-900'}`}>BEMVINDO10</p>
            </div>

            <Button full size="lg" onClick={() => {
              setWelcomePopup(false);
              vibrate([50, 100]);
              const c: Coupon = { id: 'welcome', val: 10, title: '🎁 BEMVINDO10', code: 'BEMVINDO10' };
              setUser(u => ({ ...u, hasSeenWelcome: true, coupons: [...u.coupons, c] }));
              setBooking(b => ({ ...b, appliedCoupon: c }));
              addToast(T.toast_coupon_success);
            }}>{T.get_coupon}</Button>
          </div>
        </div>
      )}

      {/* ── LEVEL UP POPUP ── */}
      {levelUpPopup && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fade-in">
          <div className={`relative w-full max-w-sm rounded-[2rem] p-7 text-center border shadow-2xl animate-scale-in overflow-hidden ${isDark ? 'bg-[#0d0f16] border-amber-500/30' : 'bg-white border-amber-200'}`}>
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-5 bg-gradient-to-br from-amber-400 to-amber-600 text-zinc-950 shadow-xl shadow-amber-500/30 animate-bounce-slow relative z-10`}>
              <Icon name="trophy" size={30} />
            </div>

            <h3 className={`font-display text-3xl mb-2 relative z-10 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.levelup_popup_title}</h3>
            <p className={`text-sm leading-relaxed mb-7 relative z-10 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{T.levelup_popup_msg}</p>

            <Button full size="lg" variant="amber" onClick={() => { setLevelUpPopup(false); vibrate(50); }} className="relative z-10">
              {T.level_redeem}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
