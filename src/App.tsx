import React, { useState, useEffect, useMemo, useRef, useCallback, memo } from 'react';

// ==================================================================================
// DESIGN TOKENS & CONFIG — v27 (STORAGE KEY MANTIDO)
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
  START_HOUR: 9,
  END_HOUR: 22,
  MAX_STORAGE_SIZE: 5000
};

const RUSH_HOURS = ['12:00', '13:00', '17:00', '18:00'];
const RUSH_FEE = 15;

const ICON_PATHS = {
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
  'scissors': 'M6 9L12 15 18 9 M6 20a3 3 0 0 1-3-3v-6l6 6v3z M18 20a3 3 0 0 0 3-3v-6l-6 6v3z',
};

// ==================================================================================
// GLOBAL STYLES — Tipografia acessível (astigmatismo) + Luxury Aesthetic
// ==================================================================================
const GlobalStyles = memo(({ isDark }) => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;0,800;1,500&display=swap');

    *, *::before, *::after {
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    :root {
      /* Tipografia acessível — maior base, espaçamento generoso */
      --font-sans: 'Poppins', sans-serif;
      --font-display: 'Poppins', sans-serif;
      --base-size: 15px;
      --line-height-body: 1.75;
      --letter-spacing-body: 0.018em;

      /* Cores */
      --c-bg: ${isDark ? '#08090e' : '#f4f3ef'};
      --c-surface: ${isDark ? '#0f1018' : '#ffffff'};
      --c-surface2: ${isDark ? '#161922' : '#f8f7f3'};
      --c-border: ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.09)'};
      --c-border-strong: ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.16)'};
      /* Texto OFF-WHITE — não puro #fff, melhor para astigmatismo */
      --c-text: ${isDark ? '#edeae4' : '#1a1714'};
      --c-text-2: ${isDark ? '#9c9790' : '#6b6560'};
      --c-text-3: ${isDark ? '#5c5850' : '#9a9590'};
      --c-blue: #3b82f6;
      --c-blue-bright: #60a5fa;
      --c-amber: #f59e0b;
      --c-emerald: #10b981;
      --c-rose: #f43f5e;
      --c-glow-blue: rgba(59,130,246,0.3);
      --c-glow-amber: rgba(245,158,11,0.3);
      --c-glow-emerald: rgba(16,185,129,0.3);

      /* Raios */
      --radius-sm: 12px;
      --radius-md: 16px;
      --radius-lg: 20px;
      --radius-xl: 24px;
      --radius-2xl: 32px;
    }

    html, body {
      background-color: var(--c-bg);
      color: var(--c-text);
      font-family: var(--font-sans);
      font-size: var(--base-size);
      line-height: var(--line-height-body);
      letter-spacing: var(--letter-spacing-body);
      font-weight: 400;
      transition: background-color 0.4s ease, color 0.4s ease;
      overscroll-behavior-y: none;
      -webkit-tap-highlight-color: transparent;
    }

    /* Sem pesos finos — mínimo 400 para acessibilidade */
    p, li, span, label { font-weight: 400; }
    h1, h2, h3, h4, h5, h6 { font-weight: 700; letter-spacing: -0.02em; line-height: 1.2; }
    strong, b { font-weight: 600; }

    /* Tamanhos mínimos de fonte legíveis */
    .text-xs  { font-size: 13px !important; }
    .text-sm  { font-size: 14.5px !important; }
    .text-base{ font-size: 15px !important; }
    .text-lg  { font-size: 17px !important; }
    .text-xl  { font-size: 19px !important; }
    .text-2xl { font-size: 22px !important; }
    .text-3xl { font-size: 26px !important; }
    .text-4xl { font-size: 32px !important; }
    .text-5xl { font-size: 40px !important; }

    /* RÓTULOS PEQUENOS — uppercase tracking — mínimo 11px */
    .label-micro {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      line-height: 1.4;
    }

    /* Scrollbar */
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--c-border-strong); border-radius: 2px; }

    /* Animations */
    @keyframes fadeUp    { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn    { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideRight{ from { transform: translateX(110%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes scaleIn   { from { transform: scale(0.88); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    @keyframes checkPop  { 0% { transform: scale(0) rotate(-15deg); } 60% { transform: scale(1.25) rotate(5deg); } 100% { transform: scale(1) rotate(0); } }
    @keyframes spin      { to { transform: rotate(360deg); } }
    @keyframes ping      { 75%, 100% { transform: scale(2); opacity: 0; } }
    @keyframes pulse     { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
    @keyframes bounce    { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
    @keyframes loadingBar{ 0% { transform: translateX(-100%) scaleX(0.5); } 50% { transform: translateX(0%) scaleX(1); } 100% { transform: translateX(100%) scaleX(0.5); } }
    @keyframes toast-in  { from { transform: translateY(-20px) scale(0.94); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
    @keyframes shake     { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
    @keyframes slideUp   { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes popIn     { 0% { transform: scale(0.85) translateY(16px); opacity: 0; } 70% { transform: scale(1.03) translateY(-2px); opacity: 1; } 100% { transform: scale(1) translateY(0); opacity: 1; } }

    .animate-fade-up     { animation: fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) forwards; }
    .animate-fade-in     { animation: fadeIn 0.3s ease forwards; }
    .animate-slide-right { animation: slideRight 0.4s cubic-bezier(0.16,1,0.3,1) forwards; }
    .animate-scale-in    { animation: scaleIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards; }
    .animate-check-pop   { animation: checkPop 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards; }
    .animate-spin        { animation: spin 0.7s linear infinite; }
    .animate-ping        { animation: ping 1.2s cubic-bezier(0,0,0.2,1) infinite; }
    .animate-pulse       { animation: pulse 2s cubic-bezier(0.4,0,0.6,1) infinite; }
    .animate-bounce-slow { animation: bounce 2.5s ease-in-out infinite; }
    .animate-toast-in    { animation: toast-in 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards; }
    .animate-shake       { animation: shake 0.35s cubic-bezier(.36,.07,.19,.97) both; }
    .animate-slide-up    { animation: slideUp 0.35s cubic-bezier(0.16,1,0.3,1) forwards; }
    .animate-pop-in      { animation: popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards; }
    .loading-bar-anim    { animation: loadingBar 1.8s ease-in-out infinite; }

    /* Gradient text */
    .text-gradient-blue  { background: linear-gradient(135deg,#60a5fa,#818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .text-gradient-amber { background: linear-gradient(135deg,#fcd34d,#f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

    /* Glass surfaces */
    .glass        { background: ${isDark ? 'rgba(15,16,24,0.88)' : 'rgba(255,255,255,0.88)'}; backdrop-filter: blur(28px) saturate(160%); -webkit-backdrop-filter: blur(28px) saturate(160%); border: 1px solid var(--c-border); }
    .glass-strong { background: ${isDark ? 'rgba(12,13,20,0.97)' : 'rgba(255,255,255,0.98)'}; backdrop-filter: blur(48px) saturate(200%); -webkit-backdrop-filter: blur(48px) saturate(200%); }

    /* Card hover */
    .card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease; }
    .card-hover:hover { transform: translateY(-2px); }

    /* Service cards */
    .service-ring        { box-shadow: 0 0 0 2px var(--c-blue), 0 8px 32px rgba(59,130,246,0.18); }
    .service-ring-amber  { box-shadow: 0 0 0 2px var(--c-amber), 0 8px 32px rgba(245,158,11,0.18); }

    /* Input focus */
    .input-field:focus { outline: none; border-color: var(--c-blue); box-shadow: 0 0 0 3.5px rgba(59,130,246,0.18); }

    /* Tab content */
    .tab-content { animation: fadeUp 0.35s ease both; }

    /* ─── MODAL OVERLAY — sempre centralizado ─── */
    .modal-overlay {
      position: fixed; inset: 0; z-index: 80;
      display: flex; align-items: center; justify-content: center;
      padding: 1rem;
      background: rgba(0,0,0,0.88);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      animation: fadeIn 0.25s ease forwards;
    }
    .modal-box {
      position: relative;
      width: 100%; max-width: 480px;
      max-height: 90vh;
      border-radius: var(--radius-2xl);
      border: 1px solid var(--c-border);
      display: flex; flex-direction: column;
      overflow: hidden;
      animation: popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards;
      box-shadow: 0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04);
    }
    .modal-box-wide { max-width: 560px; }
    .modal-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 1.5rem 1.75rem 1.25rem;
      flex-shrink: 0;
      border-bottom: 1px solid var(--c-border);
    }
    .modal-body   { overflow-y: auto; flex: 1; padding: 1.5rem 1.75rem; }
    .modal-footer { padding: 1.25rem 1.75rem 1.5rem; border-top: 1px solid var(--c-border); flex-shrink: 0; }

    /* ─── BOTÃO X DO MODAL ─── */
    .modal-close {
      width: 36px; height: 36px;
      display: flex; align-items: center; justify-content: center;
      border-radius: 10px;
      border: 1px solid var(--c-border);
      background: transparent;
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
      flex-shrink: 0;
      color: var(--c-text-2);
    }
    .modal-close:hover {
      background: rgba(255,255,255,0.08);
      color: var(--c-text);
    }

    /* Emoji */
    .emoji-icon { font-style: normal; display: inline-block; line-height: 1; vertical-align: middle; }

    /* Stagger reveals */
    .stagger-1 { animation: fadeUp 0.5s 0.05s both; }
    .stagger-2 { animation: fadeUp 0.5s 0.12s both; }
    .stagger-3 { animation: fadeUp 0.5s 0.19s both; }
    .stagger-4 { animation: fadeUp 0.5s 0.26s both; }

    button { position: relative; overflow: hidden; cursor: pointer; border: none; background: none; }
    button:disabled { opacity: 0.45; cursor: not-allowed; }
  `}} />
));

// ==================================================================================
// UTILITIES
// ==================================================================================
const sanitizeInput = (v) => String(v || '').replace(/[<>&"']/g, '');
const validateAddress = (a) => !!(a.street && a.number && a.district && a.city);
const vibrate = (pattern = 50) => { try { if (navigator?.vibrate) navigator.vibrate(pattern); } catch {} };
const maskCEP = (v) => v.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);

const formatMoney = (val, lang) => {
  if (val === undefined || isNaN(val)) return lang === 'pt' ? 'R$ 0,00' : '$ 0.00';
  const converted = lang === 'pt' ? val : val / CONFIG.EXCHANGE_RATE;
  return lang === 'pt' ? `R$ ${converted.toFixed(2).replace('.', ',')}` : `$ ${converted.toFixed(2)}`;
};

const cleanupStorage = () => {
  try {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('@thaly_app')) { try { JSON.parse(localStorage.getItem(key) || '{}'); } catch { localStorage.removeItem(key); } }
    });
  } catch {}
};

// ==================================================================================
// ICON COMPONENT
// ==================================================================================
const Icon = memo(({ name, size = 20, className = '', style, isEmoji = false }) => {
  if (isEmoji) return <span className={`emoji-icon shrink-0 ${className}`} style={{ fontSize: size, ...style }} role="img">{name}</span>;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`} style={style} aria-hidden="true">
      <path d={ICON_PATHS[name] || ''} />
    </svg>
  );
});

// ==================================================================================
// DATA & TRANSLATIONS
// ==================================================================================
const getFullReviews = (lang) => [
  { n: "Gustavo", loc: "Bela Vista - SP", t: "O Thalyson chegou na hora certa. A experiência em casa foi incrível. Mãos com técnica sem igual, o alívio foi imediato. Levantei parecendo 10kg mais leve.", serv: "Experiência Fusion", s: 5 },
  { n: "Giovana", loc: "Hotel Portal da Mata, Santa Fé", t: "Você tem mãos abençoadas! Precisava muito desse descanso. Foi super respeitoso a todo tempo e me relaxou demais. Obrigada! ❤️", serv: "Massagem Sensorial", s: 5 },
  { n: "Bruno", loc: "SP - Bela Vista", t: "Thalyson, quero dizer que sua massagem foi muito bem executada. Recomendo muito.", serv: "Massagem Clássica", s: 5 },
  { n: "Lucas", loc: "Londrina", t: "Sendo casado, a discrição era minha prioridade e fui atendido com total sigilo. A massagem tântrica me permitiu redescobrir meu próprio corpo. Sensacional.", serv: "Massagem Nuru", s: 5 },
  { n: "Ricardo", loc: "Fernandópolis", t: "Encontrei um profissionalismo raro. Me senti à vontade para soltar minhas travas. Saí de lá me sentindo 10kg mais leve, física e emocionalmente.", serv: "Massagem Reversa Clássica", s: 5 }
];

const getData = (lang) => {
  const isEn = lang === 'en';
  const p = {
    depil: 107, relax: 157, sens: 177, naturista: 197, titan: 207, reversa: 260, nuru: 317, crossfit: 187,
    pes: 110, maos: 110, combo_pm: 190,
    pack1: { v: 297, full: 334, save: 37 },
    pack2: { v: 387, full: 467, save: 80 },
    pack3: { v: 637, full: 721, save: 84 },
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
      { id: 'pes', category: 'express', min: 40, price: p.pes, icon: "🦶", isEmoji: true, tag: isEn ? "FOOT RELIEF" : "ALÍVIO NOS PÉS", title: isEn ? "Foot Massage" : "Massagem nos Pés", desc: isEn ? "Complete relief for tired feet after a long day." : "Alívio completo e direto para pés cansados após um dia longo de trabalho.", details: isEn ? "Step 1: Foot reflexology\nStep 2: Deep pressure points" : "1. Reflexologia focada na sola dos pés.\n2. Pressão profunda em pontos de tensão.\n3. Liberação completa para você pisar mais leve." },
      { id: 'maos', category: 'express', min: 40, price: p.maos, icon: "🖐️", isEmoji: true, tag: isEn ? "HAND RELIEF" : "ALÍVIO NAS MÃOS", title: isEn ? "Hand Massage" : "Massagem nas Mãos", desc: isEn ? "Release tension from typing and working with your hands." : "Libere a tensão acumulada de digitar ou usar muito as mãos no trabalho.", details: isEn ? "Step 1: Joint stretching\nStep 2: Deep palm massage" : "1. Alongamento das articulações dos dedos.\n2. Massagem profunda na palma da mão.\n3. Alívio de dores nos punhos e antebraço." },
      { id: 'relaxante', category: 'relax', min: 40, price: p.relax, icon: "user-check", tag: isEn ? "MUSCLE RELIEF" : "ALÍVIO MUSCULAR", title: isEn ? "Classic Massage" : "Massagem Clássica", desc: isEn ? "Stiff back? This takes that giant weight off your shoulders." : "Ideal para quem está com as costas travadas e o corpo rígido. Foco total em soltar os músculos.", details: isEn ? "Step 1: Use of wooden rollers\nStep 2: Soft touch manually\nStep 3: No intimate touch" : "1. Uso de rolos de madeira para quebrar os 'nós' musculares.\n2. Massagem manual profunda para soltar tensões fortes.\n3. Foco em relaxamento e saúde (Sem toques íntimos).\n4. Você sai da sessão parecendo que tirou 10kg das costas." },
      { id: 'naturista', category: 'relax', min: 40, price: p.naturista, icon: "sun", tag: isEn ? "ZERO TIES" : "ZERO ROUPAS", title: isEn ? "Naturist Classic" : "Clássica Naturista", desc: isEn ? "Total freedom, no clothes, light touches to loosen every muscle." : "Massagem de corpo inteiro, completamente sem roupas (nós dois). Perfeita para liberdade total.", details: isEn ? "Step 1: Full classic massage (undressed)\nStep 2: Deep body relief\nStep 3: No intimate touches" : "1. Massagem feita com ambos completamente nus.\n2. Pressão exata para desmanchar a rigidez do corpo.\n3. Alívio profundo sem bloqueios.\n4. Atenção: Foco terapêutico e relaxante (Sem toques íntimos)." },
      { id: 'crossfit', category: 'relax', min: 60, price: p.crossfit, icon: "🏋️‍♂️", isEmoji: true, tag: isEn ? "DEEP RECOVERY" : "RECUPERAÇÃO", title: isEn ? "Crossfit Lovers" : "Massagem para Atletas", desc: isEn ? "Sports massage with a firm grip for stiff muscles." : "Massagem com pegada forte, feita para quem treina pesado e precisa aliviar dores pós-treino.", details: isEn ? "Step 1: Vigorous friction\nStep 2: Myofascial release" : "1. Fricção forte para aquecer os músculos cansados.\n2. Liberação miofascial com foco em pernas, costas e ombros.\n3. Uso de pomadas que esquentam e aliviam a dor na hora.\n4. Alongamentos para destravar e devolver a mobilidade." },
      { id: 'sensitiva', category: 'final', min: 60, price: p.sens, icon: "sparkles", tag: isEn ? "REDUCES ANXIETY" : "TIRA A ANSIEDADE", title: isEn ? "Sensory Massage" : "Massagem Sensorial", desc: isEn ? "Subtle touches that give you full-body shivers." : "Toques muito suaves pelo corpo todo que causam arrepios e desligam a sua mente acelerada.", details: isEn ? "Step 1: Classic massage\nStep 2: Subtle stimuli\nStep 3: Climax" : "1. Início com massagem clássica para aquecer a pele.\n2. Estímulos super leves usando as mãos e a respiração que arrepiam o corpo.\n3. Construção do prazer aos poucos, focada em esvaziar sua mente.\n4. Finalização manual focada numa liberação intensa de tensão (gozo)." },
      { id: 'mista', category: 'final', min: 60, price: p.titan, icon: "zap", tag: isEn ? "BEST OF BOTH WORLDS" : "O MELHOR DOS 2", title: isEn ? "Fusion Experience" : "Experiência Fusion", desc: isEn ? "First I take the pain from your back, then I take you to a climax." : "A mais completa: primeiro eu tiro toda a dor das suas costas, depois te levo a um prazer que zera o estresse.", details: isEn ? "Step 1: Classic massage\nStep 2: Intimate contact\nStep 3: Release" : "1. Começa como massagem clássica para soltar todos os músculos travados.\n2. Muda o ritmo: contato corpo a corpo íntimo.\n3. O calor aumenta, envolvendo todos os seus sentidos.\n4. Termina com uma estimulação e gozo intenso para recarregar as baterias." },
      { id: 'reversa', category: 'final', min: 60, price: p.reversa, icon: "refresh-cw", tag: isEn ? "REAL CONTACT" : "CONTATO REAL", title: isEn ? "Reverse Massage" : "Massagem Reversa", desc: isEn ? "I do a massage on you, then you take control and do it on me." : "Metade do tempo eu cuido de você, depois você assume o controle, toca em mim e nós dois aproveitamos.", details: isEn ? "Step 1: Relaxing classic massage\nStep 2: You take control" : "1. Eu faço uma massagem relaxante completa em você (aprox. 30 minutos).\n2. O controle passa para você: sinta-se à vontade para me tocar e explorar.\n3. Quebra da frieza cliente-profissional: é pura conexão humana.\n4. Finalização mútua e troca de carinho que realiza qualquer vontade." },
      { id: 'nuru', category: 'final', min: 60, price: p.nuru, icon: "star", popular: true, tag: isEn ? "TOTAL SURRENDER" : "ENTREGA TOTAL", title: isEn ? "Nuru Massage" : "Massagem Nuru", desc: isEn ? "Gliding gel, parts of my body sliding over yours." : "Para quando você está no limite. Muito gel deslizando, contato extremo pele com pele.", details: isEn ? "Step 1: Full massage\nStep 2: Warm gel\nStep 3: Skin on skin" : "1. Massagem inicial rápida para aquecer e soltar o corpo.\n2. Aplicação de bastante gel especial em nós dois.\n3. Contato total pele na pele: uso partes do meu corpo deslizando sobre o seu.\n4. A viagem final mais prazerosa e intensa para você gozar e apagar." },
      { id: 'depilacao', category: 'care', min: 60, price: p.depil, icon: "scissors", tag: isEn ? "PRACTICALITY" : "ESTÉTICA", title: isEn ? "Full Body Trim" : "Aparo de Pelos do Corpo", desc: isEn ? "Leave with a clean, light body ready for the week." : "Sem tempo para se cuidar? Eu aparo os pelos do seu corpo com máquina profissional.", details: isEn ? "Step 1: Trim with clippers\nStep 2: Focus on body parts" : "1. Aparo com máquina (pente zero ou três) feito de forma cuidadosa.\n2. Foco nas regiões que você escolher (peito, costas, abdômen ou pernas).\n3. Feito no conforto da sua casa ou hotel.\n4. Resultado: Corpo mais limpo, menos suor e visual muito mais agradável." }
    ],
    plans: [
      { id: 'pack_essencial', type: 'pack', title: isEn ? "Survival Kit (2x)" : "Kit Sobrevivência (2x)", price: p.pack1.v, fullPrice: p.pack1.full, savings: p.pack1.save, desc: isEn ? "Two sessions to cure pain and mind." : "O básico essencial. Duas sessões agendadas no mês: um dia para tirar dores, outro para aliviar a mente.", details: isEn ? "1x Classic\n1x Sensory" : "1x Massagem Clássica (para tirar as dores e nós musculares)\n1x Massagem Sensorial (para esvaziar a cabeça com toques e prazer)\nSessões agendadas separadamente no mês\nIdeal para garantir que você não surte com a rotina", tag: isEn ? "PERFECT SLEEP" : "DURMA BEM", icon: "layers" },
      { id: 'pack_interativo', type: 'pack', title: isEn ? "Real Connection (2x)" : "Combo Conexão (2x)", price: p.pack2.v, fullPrice: p.pack2.full, savings: p.pack2.save, desc: isEn ? "Missing human contact? Two encounters to forget loneliness." : "Para quem precisa de contato humano real e intimidade. Dois encontros no mês.", details: isEn ? "1x Fusion\n1x Reverse" : "1x Experiência Fusion (relaxamento que termina com muito prazer)\n1x Massagem Reversa (o dia para você matar a vontade de tocar e explorar)\nSessões marcadas em dias diferentes\nFoco 100% em te dar calor humano e atenção exclusiva", tag: isEn ? "END OF LONELINESS" : "MAIS CALOR HUMANO", icon: "heart" },
      { id: 'pack_premium', type: 'pack', title: isEn ? "Boss Plan (3x)" : "Mensalidade do Chefe (3x)", price: p.pack3.v, fullPrice: p.pack3.full, savings: p.pack3.save, desc: isEn ? "You deserve to be treated like a king. Three weeks guaranteed." : "Você trabalha demais, merece um tratamento VIP. Três semanas do mês garantidas.", details: isEn ? "1x Naturist\n1x Fusion\n1x Nuru" : "1x Naturista (liberdade sem roupas para soltar as amarras)\n1x Fusion (equilíbrio perfeito entre massagem forte e clímax quente)\n1x Nuru (contato extremo com gel para o maior relaxamento possível)\nTrês encontros VIP para garantir que seu mês seja um sucesso sem estresse", tag: isEn ? "MONTH'S REWARD" : "TRATAMENTO DE REI", icon: "award" }
    ],
    extras: [
      { id: 'hair_trim', price: p.extras.hair_trim, icon: "✂️", isEmoji: true, label: isEn ? "Trim (Extra)" : "Aparo de Pelos", desc: isEn ? "Maintenance in 2 body parts." : "Aparo de pelos com máquina em até 2 áreas do corpo." },
      { id: 'more_time', price: p.extras.more_time, icon: "⏱️", isEmoji: true, label: isEn ? "Extended Time (+30m)" : "Mais 30 Minutos", desc: isEn ? "Because when it's good, we don't want it to end." : "Adicione mais 30 minutos na sua sessão para curtir sem pressa." },
      { id: 'touch', price: p.extras.touch, icon: "🖐️", isEmoji: true, label: isEn ? "Organic Interaction" : "Liberdade para Tocar", desc: isEn ? "Feel free to participate and touch as well." : "Você terá liberdade total para me tocar e participar ativamente." },
      { id: 'aroma', price: p.extras.aroma, icon: "🌸", isEmoji: true, label: isEn ? "Deep Aromatherapy" : "Aromaterapia", desc: isEn ? "Essential oils that lower your mental frequency." : "Uso de óleos essenciais relaxantes no ambiente e corpo." },
      { id: 'pain_relief', price: p.extras.pain_relief, icon: "💊", isEmoji: true, label: isEn ? "Extra Focus on Pain" : "Alívio de Dores Fortes", desc: isEn ? "Ointment for strong pain relief." : "Atenção extra nas áreas travadas usando pomadas térmicas potentes." },
      { id: 'dominador', price: p.extras.dominador, icon: "🔥", isEmoji: true, label: isEn ? "Active & Dominant" : "Postura Dominadora", desc: isEn ? "I take full control at the end." : "Eu assumo uma postura mais ativa e dominadora durante a parte final." },
      { id: 'oral', price: p.extras.oral, icon: "👅", isEmoji: true, label: isEn ? "Oral Included" : "Estímulo Oral", desc: isEn ? "Oral intimacy included." : "Inclusão de contato oral quente e direto para maximizar seu prazer." },
      { id: 'beijos', price: p.extras.beijos, icon: "💋", isEmoji: true, label: isEn ? "Kisses Included" : "Beijos e Intimidade", desc: isEn ? "Kisses and affection allowed." : "Beijos na boca de verdade e muita intimidade física liberada." },
      { id: 'prostatico', price: p.extras.prostatico, icon: "💦", isEmoji: true, label: isEn ? "Prostatic Massage" : "Massagem Prostática", desc: isEn ? "Manual prostatic stimulation." : "Estimulação interna intensa da próstata com lubrificante." }
    ],
    faq: [
      { q: isEn ? "How do the touch and the ending work?" : "Como a finalização funciona na prática?", a: isEn ? "Everything is conducted with extreme respect. The objective is to create a space where you can fully relax and arrive at an intense climax." : "Tudo é conduzido com muito respeito ao seu tempo e ao seu corpo. O objetivo é criar um espaço onde você possa confiar, se soltar totalmente e chegar a um clímax intenso que vai tirar todo o peso da sua semana." },
      { q: isEn ? "Where is our meeting location?" : "Onde nós vamos nos encontrar?", a: isEn ? "I come to you for your greatest comfort — your home, apartment, or hotel. I bring everything needed to transform your space into the most relaxing place possible." : "Eu vou até você para o seu maior conforto. Pode ser na sua casa, no seu apartamento ou em um hotel. Eu levo o necessário para transformar o ambiente no lugar mais relaxante possível." },
      { q: isEn ? "How should I prepare for the session?" : "O que eu preciso fazer antes da sessão?", a: isEn ? "Come with an open heart! The only requirement is a warm, relaxing shower close to my arrival time. It starts to soften the muscles and prepares the skin for contact." : "Venha de coração aberto! A única exigência é que você tome um banho quente e relaxante bem perto do horário da minha chegada. Isso já começa a amolecer os músculos e deixa a pele preparada para o contato." },
      { q: isEn ? "I'm ashamed of my body, what now?" : "Tenho vergonha do meu corpo ou peso, o que eu faço?", a: isEn ? "Forget about that completely. My environment is one of welcoming with zero judgment. It doesn't matter your age, weight, or body marks. I'm going there exclusively to take care of you." : "Esqueça completamente isso. Meu ambiente é de acolhimento zero julgamentos. Não importa sua idade, seu peso ou as marcas do seu corpo. Eu estou indo aí exclusivamente para cuidar de você." },
      { q: isEn ? "Are my points and level saved in the app?" : "Como o aplicativo salva meu progresso (XP)?", a: isEn ? "Yes! To make it easy, your progress is saved directly in your phone's browser. Just be careful: if you format your phone or clear your browser cache, the points restart from zero." : "Para facilitar e não precisar de senhas, seu progresso é salvo direto no navegador do seu celular. Só tome cuidado: se você formatar o celular ou limpar o cache do navegador, os pontos recomeçam do zero." }
    ],
    rules: [
      { icon: "shower", title: isEn ? "The Prep Shower" : "A Ducha Preparatória", description: isEn ? "A prior shower is essential. Hot water relaxes the muscles and hygiene ensures our contact is perfect and focused." : "O banho prévio é obrigatório. A água quente relaxa os músculos e a higiene garante que o nosso contato seja perfeito e focado." },
      { icon: "hand", title: isEn ? "Welcoming and Respect" : "Acolhimento e Respeito Mútuo", description: isEn ? "Mutual respect is key. I dedicate myself to taking care of you. In return, respect ensures the environment is light, free, and enjoyable." : "Eu me dedico a cuidar de você. Em troca, o respeito deve ser mútuo para que o ambiente seja leve, livre e muito gostoso." },
      { icon: "heart", title: isEn ? "Absolute Surrender" : "Entrega Absoluta", description: isEn ? "Forget the outside world. Turn off your mind, problems stay outside. The focus now is only to feel and enjoy." : "O momento que estamos juntos é só seu. Desligue a mente, os problemas ficam lá fora. O foco agora é apenas sentir e aproveitar." },
      { icon: "shield", title: isEn ? "Health and Integrity" : "Saúde e Prevenção", description: isEn ? "By booking, you ensure you are in good health, with no open injuries or contagious diseases, keeping our meeting safe." : "Ao agendar, você garante que está com a saúde em dia, sem lesões abertas ou doenças contagiosas, mantendo nosso encontro seguro." }
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
      toast_select_date: isEn ? "Choose a date and time for our encounter." : "Selecione uma data e horário válidos.",
      toast_fill_name: isEn ? "Fill in your name to continue." : "Por favor, preencha o seu nome corretamente.",
      toast_fill_addr: isEn ? "Fill in the location so I can visit you." : "Preencha o endereço completo para eu saber onde ir.",
      toast_accept_terms: isEn ? "Please read and accept our agreement." : "Você precisa ler e aceitar as regras para confirmar.",
      toast_coupon_success: isEn ? "Gift applied! Discount activated. 🎁" : "Presente ativado! O seu desconto foi aplicado. 🎁",
      toast_coupon_invalid: isEn ? "Invalid or expired code." : "Código inválido ou já expirou.",
      toast_cep_found: isEn ? "Address loaded automatically." : "Localização encontrada pelo CEP.",
      toast_cep_error: isEn ? "CEP not found." : "Não consegui encontrar este CEP.",
      details_label: isEn ? "WHAT YOU WILL EXPERIENCE:" : "PASSO A PASSO DO QUE VAI ACONTECER:",
      select_time_title: isEn ? "Choose the perfect moment" : "Escolha a data do nosso encontro",
      location_title: isEn ? "Where will our encounter be?" : "Onde nós vamos nos ver?",
      extras_title: isEn ? "Add something special" : "Adicione complementos opcionais",
      coupon_section: isEn ? "Your Benefits" : "Seus Benefícios e Cupons",
      payment_title: isEn ? "Payment method (at the meeting)" : "Forma de pagamento (você paga no local)",
      terms_title: isEn ? "Delivery Agreement" : "Regras e Acordos",
      success_title: isEn ? "Almost there!" : "Tudo Certo! Falta Pouco",
      success_sub: isEn ? "WhatsApp is opening automatically to confirm." : "Vou abrir o seu WhatsApp agora para você me enviar o pedido. Se não abrir sozinho, clique no botão abaixo.",
      whatsapp_btn: isEn ? "Open WhatsApp" : "Enviar Pedido no WhatsApp",
      back_home: isEn ? "Start over" : "Voltar para o início",
      timer_text: isEn ? "Cart saved for" : "Sua reserva salva por",
      input_name: isEn ? "Your name or nickname" : "Qual o seu nome ou apelido?",
      input_cep: isEn ? "ZIP Code (CEP)" : "Digite o CEP do local",
      input_addr: isEn ? "Street or Avenue" : "Qual a Rua ou Avenida?",
      input_num: isEn ? "Number" : "Número do local",
      input_district: isEn ? "Neighborhood" : "Bairro",
      input_city: isEn ? "City" : "Cidade",
      input_comp: isEn ? "Apt, Block (Optional)" : "Complemento (Apto, Bloco) — Opcional",
      input_hotel: isEn ? "Hotel name" : "Qual o nome do Hotel?",
      input_room: isEn ? "Room / Suite Number" : "Qual o número do Quarto / Suíte?",
      agree_terms: isEn ? "I read and agree to the terms" : "Eu li e aceito todas as regras",
      faq_title: isEn ? "Frequently Asked Questions" : "Tire as Suas Dúvidas",
      reviews_title: isEn ? "Those who allowed themselves:" : "O que os clientes estão dizendo:",
      empty_date: isEn ? "Tap a day above to see available times." : "Toque em um dia acima para ver os horários.",
      empty_slots: isEn ? "Schedule full for this day. Try the next one?" : "Minha agenda está cheia nesse dia. Que tal tentar o próximo?",
      total_label: isEn ? "Total" : "Total a Pagar",
      subtotal: isEn ? "Subtotal" : "Valor Inicial",
      discount: isEn ? "Discount" : "Desconto Aplicado",
      pix_discount: isEn ? "Pix (3% OFF)" : "Desconto Pix (3%)",
      welcome_popup_title: isEn ? "Welcome!" : "Que bom ter você aqui!",
      welcome_popup_msg: isEn ? "I'm glad you decided to take time to care for yourself. Here is a gift for our first time." : "A maioria dos homens esquece de cuidar de si mesmos na correria do dia a dia. Para comemorar nossa primeira vez, pegue esse presente.",
      welcome_popup_warning: isEn ? "⚠️ Your progress is saved in this browser. Avoid clearing cache data." : "⚠️ Seus pontos são salvos aqui neste celular. Não limpe o cache do navegador para não perder seu nível.",
      levelup_popup_title: isEn ? "Level Up!" : "Parabéns, você subiu de nível!",
      levelup_popup_msg: isEn ? "Your consistency generated rewards. A new exclusive benefit has been unlocked." : "Você cuidou bem do seu corpo recentemente, e isso te rendeu uma recompensa. Um novo benefício acabou de ser liberado.",
      get_coupon: isEn ? "Claim My Gift" : "Pegar Meu Presente Agora",
      rules_complete: isEn ? "Our Mutual Agreement" : "Leia para Confirmarmos",
      media_discount: isEn ? "Portfolio Discount (1%)" : "Desconto do Portfólio (1%)",
      media_title: isEn ? "Support my work (Optional)" : "Quer apoiar meu trabalho? (Opcional)",
      media_desc: isEn ? "Allow anonymous aesthetic photos (body outline only, no face/intimacy) for my portfolio and get 1% OFF." : "Deixe eu tirar fotos profissionais e anônimas de detalhes do seu corpo (NUNCA mostrando rosto ou intimidade) para meu portfólio. Ganhe 1% OFF.",
      media_bonus: isEn ? "Allow for 1% OFF" : "Permitir e ganhar 1% OFF",
      uber_notice: isEn ? "Travel fee (Uber) will be calculated and confirmed via WhatsApp." : "Importante: A taxa do Uber para eu ir até você será calculada e avisada no WhatsApp.",
      motel_note: isEn ? "My private suite address will be sent via WhatsApp after booking." : "Perfeito! Assim que você finalizar o agendamento, eu te mando o endereço da minha suíte privada pelo WhatsApp.",
      menu_title: isEn ? "Settings" : "Configurações",
      level_yours: isEn ? "Your Level" : "Seu Progresso de XP",
      level_current: isEn ? "XP" : "Pontos",
      level_journey: isEn ? "Progress" : "Evolução",
      menu_warning: isEn ? "* Progress saved in this browser. Avoid clearing cache." : "* Seus pontos ficam salvos na memória do seu navegador. Evite apagar o cache para não zerar.",
      theme_title: isEn ? "Appearance" : "Tema do Aplicativo",
      theme_dark: isEn ? "Dark" : "Escuro",
      theme_light: isEn ? "Light" : "Claro",
      refer_btn: isEn ? "Refer Someone" : "Indicar para um amigo",
      share_text: isEn ? 'I found the best massage to relieve all stress.' : 'Encontrei o lugar perfeito para uma massagem que tira todo o estresse.',
      header_tensions: isEn ? "moments of relief" : "homens já atendidos",
      step_when: isEn ? "When" : "Quando",
      step_where: isEn ? "Where" : "Onde",
      step_summary: isEn ? "Summary" : "Resumo",
      cart_title: isEn ? "Your selections:" : "Você escolheu:",
      cart_edit: isEn ? "Edit" : "Trocar",
      time_choose: isEn ? "Pick a time" : "Selecione a hora",
      time_rush: isEn ? "Rush (+15)" : "Horário de Pico (+R$15)",
      loc_home: isEn ? "Your Home" : "Na sua Casa",
      loc_motel: isEn ? "My Suite" : "Na minha Suíte",
      loc_hotel: isEn ? "Hotel" : "Em um Hotel",
      summary_title: isEn ? "Order Summary" : "Resumo do que você pediu",
      summary_items: isEn ? "SERVICES" : "O QUE VAMOS FAZER",
      summary_extras: isEn ? "EXTRAS" : "ADICIONAIS EXTRAS",
      summary_info: isEn ? "SESSION DETAILS" : "DADOS DO ENCONTRO",
      summary_loc_home: isEn ? "At your residence" : "Vai ser na sua residência",
      summary_loc_motel: isEn ? "At my private suite" : "Vai ser na minha suíte privada",
      summary_loc_hotel: isEn ? "At a hotel" : "Vai ser no hotel",
      coupon_applied: isEn ? "Coupon Applied" : "Presente Aplicado",
      xp_guaranteed: isEn ? "XP guaranteed" : "XP ganhos hoje",
      media_granted: isEn ? "Authorization Granted ✓" : "Fotos Autorizadas ✓",
      media_support: isEn ? "Support the Work" : "Autorizar Fotos",
      pay_pix: isEn ? "Pix (3% OFF)" : "Pix (Você ganha 3% OFF)",
      pay_card: isEn ? "Card" : "Cartão (Crédito/Débito)",
      pay_cash: isEn ? "Cash" : "Dinheiro em espécie",
      terms_read: isEn ? "Tap here to read the rules" : "Toque aqui para ler as regras",
      level_redeem: isEn ? "Claim Reward" : "Resgatar minha Recompensa",
      today: isEn ? "TODAY" : "HOJE",
      tomorrow: isEn ? "TOMORROW" : "AMANHÃ",
      popular_badge: isEn ? "✦ Most Desired" : "✦ A Mais Pedida",
      from: isEn ? "From" : "De",
      savings: isEn ? "YOU SAVE" : "VOCÊ ECONOMIZA",
      items_selected: isEn ? "selected" : "selecionado(s)",
      btn_finish_short: isEn ? "Finish" : "Finalizar",
      btn_next_short: isEn ? "Next" : "Próximo",
      msg_level_keep1: isEn ? "Only" : "Faltam apenas",
      msg_level_keep2: isEn ? "XP to unlock" : "XP para você desbloquear",
      msg_rush_fee: isEn ? "Rush Fee" : "Taxa de Pico",
      toast_loaded: isEn ? "Progress loaded! 💾" : "Seus pontos foram carregados! 💾",
      toast_cart_toggle: isEn ? "Cart updated." : "Serviço atualizado.",
      toast_pix_copied: isEn ? "PIX key copied!" : "Minha chave PIX foi copiada!",
      toast_copy: isEn ? "Copied!" : "Copiado!",
      coupon_placeholder: isEn ? "Have a code? Type here" : "Tem um código? Digite aqui",
      coupon_apply: isEn ? "Apply" : "Ativar",
      morning: isEn ? "Morning" : "Período da Manhã",
      afternoon: isEn ? "Afternoon" : "Período da Tarde",
      evening: isEn ? "Evening" : "Período da Noite",
    },
    reviews: getFullReviews(lang)
  };
};

// ==================================================================================
// CATEGORY CONFIG
// ==================================================================================
const CATEGORY_CONFIG = {
  relax:   { color: '#3b82f6', borderColor: 'rgba(59,130,246,0.28)',  bg: 'rgba(59,130,246,0.05)',  lightBg: 'rgba(59,130,246,0.04)'  },
  express: { color: '#10b981', borderColor: 'rgba(16,185,129,0.28)',  bg: 'rgba(16,185,129,0.05)',  lightBg: 'rgba(16,185,129,0.04)'  },
  final:   { color: '#f59e0b', borderColor: 'rgba(245,158,11,0.28)',  bg: 'rgba(245,158,11,0.05)',  lightBg: 'rgba(245,158,11,0.04)'  },
  care:    { color: '#ec4899', borderColor: 'rgba(236,72,153,0.28)',  bg: 'rgba(236,72,153,0.05)',  lightBg: 'rgba(236,72,153,0.04)'  },
};

// ==================================================================================
// TOAST
// ==================================================================================
const ToastContainer = memo(({ toasts, isDark }) => (
  <div style={{ position:'fixed', top:20, left:'50%', transform:'translateX(-50%)', zIndex:200, display:'flex', flexDirection:'column', gap:8, width:'calc(100% - 2rem)', maxWidth:360, pointerEvents:'none' }}>
    {toasts.map(t => (
      <div key={t.id} role="alert" className="animate-toast-in" style={{
        pointerEvents:'auto', display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderRadius:16,
        border: `1px solid ${t.type==='error' ? 'rgba(239,68,68,0.4)' : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
        background: t.type==='error' ? 'rgba(30,10,10,0.97)' : isDark ? 'rgba(15,16,24,0.98)' : 'rgba(255,255,255,0.98)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}>
        <div style={{ width:28, height:28, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, background: t.type==='error' ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)', color: t.type==='error' ? '#f87171' : '#34d399' }}>
          <Icon name={t.type==='error' ? 'alert-circle' : 'check'} size={14} />
        </div>
        <span style={{ fontSize:13, fontWeight:500, lineHeight:1.5, color: t.type==='error' ? '#fca5a5' : isDark ? '#edeae4' : '#1a1714' }}>{t.msg}</span>
      </div>
    ))}
  </div>
));

// ==================================================================================
// BUTTON
// ==================================================================================
const Button = memo(({ children, onClick, variant='primary', size='md', disabled=false, full=false, icon, className='', loading=false, style }) => {
  const variants = {
    primary: { background:'#3b82f6', color:'#fff', boxShadow:'0 4px 20px rgba(59,130,246,0.3)' },
    whatsapp: { background:'#25D366', color:'#fff', boxShadow:'0 4px 20px rgba(37,211,102,0.3)' },
    amber: { background:'#f59e0b', color:'#1a1714', fontWeight:700, boxShadow:'0 4px 20px rgba(245,158,11,0.3)' },
    outline: { background:'transparent', border:'1.5px solid currentColor' },
    ghost: { background:'transparent' },
    secondary: { background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)', color:'#edeae4' },
  };
  const sizes = {
    sm: { height:40, padding:'0 20px', fontSize:12, borderRadius:12 },
    md: { height:48, padding:'0 28px', fontSize:13, borderRadius:16 },
    lg: { height:56, padding:'0 36px', fontSize:14, borderRadius:18 },
    xl: { height:64, padding:'0 44px', fontSize:15, borderRadius:20 },
  };
  return (
    <button type="button" onClick={onClick} disabled={disabled||loading} style={{
      display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8,
      fontFamily:'Poppins,sans-serif', fontWeight:600, letterSpacing:'0.03em',
      transition:'all 0.2s ease', cursor: disabled||loading ? 'not-allowed' : 'pointer',
      width: full ? '100%' : undefined, flexShrink:0,
      ...(variants[variant]||variants.primary), ...(sizes[size]||sizes.md),
      opacity: disabled||loading ? 0.45 : 1,
      ...style,
    }} className={className}
      onMouseEnter={e => { if (!disabled&&!loading) e.currentTarget.style.transform='translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform=''; }}>
      {loading
        ? <span style={{ width:16,height:16, border:'2px solid currentColor', borderTopColor:'transparent', borderRadius:'50%' }} className="animate-spin" />
        : <>{icon && <Icon name={icon} size={18} />}{children}</>
      }
    </button>
  );
});

// ==================================================================================
// INPUT
// ==================================================================================
const InputField = memo(({ label, value, onChange, placeholder, icon, type='text', isDark=true, hasError=false, disabled=false, maxLength }) => (
  <div style={{ display:'flex', flexDirection:'column', gap:6, width:'100%' }} className={hasError ? 'animate-shake' : ''}>
    {label && (
      <label className="label-micro" style={{ paddingLeft:4, color: hasError ? '#f87171' : isDark ? '#7c7770' : '#9a9590' }}>{label}</label>
    )}
    <div style={{ position:'relative' }}>
      {icon && (
        <div style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color: hasError ? '#f87171' : isDark ? '#6b6660' : '#94908c', pointerEvents:'none' }}>
          <Icon name={icon} size={18} />
        </div>
      )}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled} maxLength={maxLength}
        className="input-field"
        style={{
          width:'100%', height:52, borderRadius:16, fontSize:15, fontWeight:500, fontFamily:'Poppins,sans-serif',
          letterSpacing:'0.01em', lineHeight:1.5,
          paddingLeft: icon ? 44 : 16, paddingRight:16,
          border: `1.5px solid ${hasError ? 'rgba(239,68,68,0.5)' : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)'}`,
          background: hasError ? 'rgba(239,68,68,0.06)' : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
          color: hasError ? '#fca5a5' : isDark ? '#edeae4' : '#1a1714',
          outline:'none', transition:'border-color 0.2s, box-shadow 0.2s',
          opacity: disabled ? 0.55 : 1,
        }} />
    </div>
  </div>
));

// ==================================================================================
// SIDE MENU
// ==================================================================================
const SideMenu = memo(({ isOpen, onClose, isDark, toggleTheme, user, T }) => {
  if (!isOpen) return null;
  return (
    <>
      <div onClick={onClose} className="animate-fade-in" style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.78)', backdropFilter:'blur(8px)', zIndex:60 }} />
      <aside className="animate-slide-right" style={{
        position:'fixed', top:0, right:0, height:'100%', width:320, maxWidth:'88vw', zIndex:70,
        background: isDark ? '#09090f' : '#fff',
        borderLeft: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`,
        boxShadow:'-8px 0 48px rgba(0,0,0,0.4)', padding:28, display:'flex', flexDirection:'column', gap:0,
      }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
          <h2 style={{ fontSize:20, fontWeight:700, margin:0 }}>{T.menu_title}</h2>
          <button onClick={onClose} className="modal-close" aria-label="Fechar menu">
            <Icon name="x" size={18} />
          </button>
        </div>

        {/* XP card */}
        <div style={{
          marginBottom:24, padding:20, borderRadius:20,
          background: isDark ? 'rgba(59,130,246,0.08)' : '#eff6ff',
          border: `1px solid ${isDark ? 'rgba(59,130,246,0.2)' : '#bfdbfe'}`,
          position:'relative', overflow:'hidden',
        }}>
          <div style={{ position:'absolute', top:-24, right:-24, width:120, height:120, background:'rgba(59,130,246,0.08)', borderRadius:'50%', filter:'blur(20px)' }} />
          <p className="label-micro" style={{ color: isDark ? '#60a5fa' : '#3b82f6', marginBottom:4 }}>{T.level_yours}</p>
          <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
            <span style={{ fontSize:42, fontWeight:800, lineHeight:1, color: isDark ? '#edeae4' : '#1a1714' }}>{user.xp}</span>
            <span className="label-micro" style={{ color: isDark ? '#60a5fa' : '#3b82f6' }}>XP</span>
          </div>
          <p style={{ fontSize:11, color: isDark ? '#5c5850' : '#9a9590', marginTop:12, paddingTop:12, borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, lineHeight:1.6 }}>{T.menu_warning}</p>
        </div>

        {/* Nav */}
        <div style={{ display:'flex', flexDirection:'column', gap:4, flex:1 }}>
          <button onClick={toggleTheme} style={{
            display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px',
            borderRadius:14, background:'transparent', transition:'background 0.2s',
            color: isDark ? '#c8c4be' : '#4b4744', width:'100%', textAlign:'left',
          }}
            onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <Icon name={isDark ? 'moon' : 'sun'} size={18} style={{ color: isDark ? '#60a5fa' : '#f59e0b' }} />
              <span style={{ fontSize:14, fontWeight:500 }}>{T.theme_title}</span>
            </div>
            <span className="label-micro" style={{ padding:'3px 10px', borderRadius:8, background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)', color: isDark ? '#7c7770' : '#9a9590' }}>
              {isDark ? T.theme_dark : T.theme_light}
            </span>
          </button>

          <button onClick={() => { if (navigator.share) navigator.share({ title: 'Thalyson Massagens', text: T.share_text, url: window.location.href }); }}
            style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 16px', borderRadius:14, background:'transparent', transition:'background 0.2s', color: isDark ? '#c8c4be' : '#4b4744', width:'100%', textAlign:'left' }}
            onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <Icon name="share" size={18} style={{ color:'#34d399' }} />
            <span style={{ fontSize:14, fontWeight:500 }}>{T.refer_btn}</span>
          </button>
        </div>
      </aside>
    </>
  );
});

// ==================================================================================
// REVIEW CARD
// ==================================================================================
const ReviewCard = memo(({ review, isDark }) => (
  <article style={{
    height:'100%', display:'flex', flexDirection:'column', padding:24, borderRadius:24,
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
    background: isDark ? 'rgba(255,255,255,0.03)' : '#fff',
    transition:'all 0.3s ease',
  }}>
    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16, gap:12 }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, minWidth:0 }}>
        <div style={{ width:44, height:44, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:700, flexShrink:0, background: isDark ? 'rgba(59,130,246,0.12)' : '#eff6ff', color: isDark ? '#60a5fa' : '#3b82f6', border: `1px solid ${isDark ? 'rgba(59,130,246,0.2)' : '#bfdbfe'}` }}>
          {review.n.charAt(0)}
        </div>
        <div style={{ minWidth:0 }}>
          <span style={{ fontSize:14, fontWeight:600, display:'block', color: isDark ? '#edeae4' : '#1a1714' }}>{review.n}</span>
          <span style={{ fontSize:12, color: isDark ? '#5c5850' : '#9a9590', display:'block', marginTop:1 }}>{review.loc}</span>
        </div>
      </div>
      <div style={{ display:'flex', gap:2, flexShrink:0 }}>
        {[...Array(5)].map((_, i) => (
          <Icon key={i} name="star" size={13} style={{ color: i < review.s ? '#f59e0b' : isDark ? '#2a2820' : '#e2e8f0', fill: i < review.s ? '#f59e0b' : 'transparent' }} />
        ))}
      </div>
    </div>
    <div style={{ display:'inline-flex', alignSelf:'flex-start', alignItems:'center', gap:6, padding:'4px 10px', borderRadius:999, fontSize:10, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:14, background: isDark ? 'rgba(245,158,11,0.08)' : '#fffbeb', border: `1px solid ${isDark ? 'rgba(245,158,11,0.2)' : '#fde68a'}`, color: isDark ? '#fbbf24' : '#d97706' }}>
      <Icon name="award" size={10} /> {review.serv}
    </div>
    <p style={{ fontSize:14, lineHeight:1.75, fontStyle:'italic', flex:1, color: isDark ? '#a8a39e' : '#64748b' }}>"{review.t}"</p>
  </article>
));

// ==================================================================================
// FAQ ITEM
// ==================================================================================
const FAQItem = memo(({ q, a, isDark }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : '#f1f5f9'}` }}>
      <button onClick={() => setOpen(!open)} style={{
        width:'100%', padding:'20px 0', display:'flex', alignItems:'center', justifyContent:'space-between', textAlign:'left', gap:16, background:'transparent',
      }}>
        <span style={{ fontSize:15, fontWeight:500, lineHeight:1.6, color: isDark ? '#d4d0cb' : '#334155' }}>{q}</span>
        <div style={{
          flexShrink:0, width:30, height:30, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center',
          border: `1.5px solid ${open ? 'transparent' : isDark ? 'rgba(255,255,255,0.12)' : '#e2e8f0'}`,
          background: open ? '#3b82f6' : 'transparent', color: open ? '#fff' : isDark ? '#7c7770' : '#94a3b8',
          transform: open ? 'rotate(180deg)' : 'none', transition:'all 0.3s ease',
        }}>
          <Icon name="chevron-down" size={15} />
        </div>
      </button>
      <div style={{ overflow:'hidden', transition:'all 0.35s ease', maxHeight: open ? 400 : 0, opacity: open ? 1 : 0, paddingBottom: open ? 20 : 0 }}>
        <p style={{ fontSize:14, lineHeight:1.8, color: isDark ? '#7c7770' : '#64748b' }}>{a}</p>
      </div>
    </div>
  );
});

// ==================================================================================
// SMART TIMER
// ==================================================================================
const SmartTimer = memo(({ isDark, text }) => {
  const [time, setTime] = useState(600);
  useEffect(() => {
    const i = setInterval(() => setTime(p => p <= 0 ? 600 : p - 1), 1000);
    return () => clearInterval(i);
  }, []);
  const fmt = (t) => `${Math.floor(t/60)}:${String(t%60).padStart(2,'0')}`;
  const pct = (time/600)*100;
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:16, padding:'14px 20px', borderRadius:20,
      background: isDark ? 'rgba(59,130,246,0.07)' : '#eff6ff',
      border: `1px solid ${isDark ? 'rgba(59,130,246,0.18)' : '#bfdbfe'}`,
    }}>
      <div style={{ position:'relative', width:52, height:52, flexShrink:0 }}>
        <svg viewBox="0 0 36 36" style={{ width:52, height:52, transform:'rotate(-90deg)' }}>
          <circle cx="18" cy="18" r="15" fill="none" stroke={isDark ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.1)'} strokeWidth="2.5" />
          <circle cx="18" cy="18" r="15" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeDasharray={`${pct*0.942} 100`} style={{ transition:'stroke-dasharray 1s ease' }} />
        </svg>
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Icon name="clock" size={17} style={{ color: isDark ? '#60a5fa' : '#3b82f6' }} />
        </div>
      </div>
      <div>
        <p className="label-micro" style={{ color: isDark ? '#60a5fa' : '#3b82f6', marginBottom:3 }}>{text}</p>
        <p style={{ fontSize:24, fontWeight:800, lineHeight:1, color: isDark ? '#edeae4' : '#1a1714' }}>{fmt(time)}</p>
      </div>
    </div>
  );
});

// ==================================================================================
// RULE ITEM
// ==================================================================================
const RuleItem = memo(({ rule, isDark }) => (
  <div style={{ display:'flex', gap:16, padding:'16px 0', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'}` }}>
    <div style={{ flexShrink:0, width:44, height:44, borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', background: isDark ? 'rgba(59,130,246,0.1)' : '#eff6ff', color: isDark ? '#60a5fa' : '#3b82f6' }}>
      <Icon name={rule.icon} size={20} />
    </div>
    <div>
      <h4 style={{ fontSize:15, fontWeight:600, margin:'0 0 5px', color: isDark ? '#edeae4' : '#1e293b' }}>{rule.title}</h4>
      <p style={{ fontSize:13, lineHeight:1.75, margin:0, color: isDark ? '#7c7770' : '#64748b' }}>{rule.description}</p>
    </div>
  </div>
));

// ==================================================================================
// SERVICE CARD
// ==================================================================================
const ServiceCard = memo(({ service, isInCart, onToggle, isDark, T, isPremium=false }) => {
  const [expanded, setExpanded] = useState(false);
  const accentColor = isPremium ? '#f59e0b' : '#3b82f6';
  return (
    <div className="card-hover" style={{
      borderRadius:24, overflow:'hidden',
      border: `1.5px solid ${isInCart ? accentColor : isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
      background: isInCart ? (isPremium ? 'rgba(245,158,11,0.05)' : 'rgba(59,130,246,0.05)') : isDark ? 'rgba(255,255,255,0.03)' : '#fff',
      boxShadow: isInCart ? `0 0 0 1px ${accentColor}40, 0 8px 32px ${accentColor}18` : isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.06)',
      transition:'all 0.3s ease',
    }}>
      {/* Selected check */}
      {isInCart && (
        <div className="animate-check-pop" style={{ position:'absolute', top:16, left:16, zIndex:10, width:26, height:26, borderRadius:'50%', background: accentColor, color: isPremium ? '#1a1714' : '#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Icon name="check" size={14} />
        </div>
      )}

      <div style={{ padding:'24px 24px 0', cursor:'pointer' }} onClick={() => onToggle(service)}>
        {/* Header row */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, marginBottom:16 }}>
          <div style={{ width:48, height:48, borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, background: isDark ? 'rgba(255,255,255,0.07)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}` }}>
            <Icon name={service.icon} size={22} isEmoji={service.isEmoji} style={{ color: isDark ? '#d4d0cb' : '#475569' }} />
          </div>
          <div style={{ textAlign:'right', flex:1, minWidth:0 }}>
            {service.fullPrice && (
              <p style={{ fontSize:11, color: isDark ? '#4a4640' : '#94a3b8', textDecoration:'line-through', marginBottom:2 }}>
                {T.from} {formatMoney(service.fullPrice, 'pt')}
              </p>
            )}
            <p style={{ fontSize:26, fontWeight:800, lineHeight:1, margin:0, color: isDark ? '#edeae4' : '#1a1714' }}>{formatMoney(service.price, 'pt')}</p>
            {service.savings && (
              <span style={{ display:'inline-block', marginTop:4, padding:'2px 8px', borderRadius:999, fontSize:10, fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', background: isDark ? 'rgba(16,185,129,0.1)' : '#ecfdf5', border: `1px solid ${isDark ? 'rgba(16,185,129,0.2)' : '#6ee7b7'}`, color: isDark ? '#34d399' : '#059669' }}>
                {T.savings} {formatMoney(service.savings, 'pt')}
              </span>
            )}
          </div>
        </div>

        {/* Tags */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:10 }}>
          <span style={{ padding:'4px 10px', borderRadius:999, fontSize:10, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', background: isPremium ? (isDark ? 'rgba(245,158,11,0.1)' : '#fffbeb') : (isDark ? 'rgba(255,255,255,0.06)' : '#f8fafc'), border: `1px solid ${isPremium ? (isDark ? 'rgba(245,158,11,0.2)' : '#fde68a') : (isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0')}`, color: isPremium ? (isDark ? '#fbbf24' : '#d97706') : (isDark ? '#7c7770' : '#94a3b8') }}>
            {service.tag}
          </span>
          {service.popular && (
            <span style={{ padding:'4px 10px', borderRadius:999, fontSize:10, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', background: accentColor, color: isPremium ? '#1a1714' : '#fff' }}>
              {T.popular_badge}
            </span>
          )}
        </div>

        <h3 style={{ fontSize:17, fontWeight:700, margin:'0 0 8px', color: isDark ? '#edeae4' : '#1e293b', lineHeight:1.3 }}>{service.title}</h3>
        <p style={{ fontSize:14, lineHeight:1.75, margin:0, color: isDark ? '#7c7770' : '#64748b' }}>{service.desc}</p>
      </div>

      {/* Expandable step-by-step */}
      <div style={{ margin:'16px 24px 0', borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : '#f1f5f9'}` }}>
        <button onClick={() => setExpanded(!expanded)} style={{
          width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 0', background:'transparent', color: isDark ? '#5c5850' : '#94a3b8', fontSize:11, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', transition:'color 0.2s',
        }}>
          {T.details_label}
          <Icon name={expanded ? 'chevron-down' : 'chevron-right'} size={14} style={{ transform: expanded ? 'rotate(0)' : '', transition:'transform 0.3s' }} />
        </button>
        <div style={{ overflow:'hidden', transition:'all 0.35s ease', maxHeight: expanded ? 320 : 0, opacity: expanded ? 1 : 0, paddingBottom: expanded ? 20 : 0 }}>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {service.details.split('\n').map((line, i) => (
              <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:8 }}>
                <span style={{ fontSize:11, fontWeight:700, marginTop:2, flexShrink:0, color: accentColor }}>→</span>
                <span style={{ fontSize:13, lineHeight:1.7, color: isDark ? '#7c7770' : '#64748b' }}>{line}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

// ==================================================================================
// MAIN APP
// ==================================================================================
export default function App() {
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [step, setStep] = useState(0);
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState('pt');
  const [activeTab, setActiveTab] = useState('single');
  const [toasts, setToasts] = useState([]);
  const [termsOpen, setTermsOpen] = useState(false);
  const [welcomePopup, setWelcomePopup] = useState(false);
  const [levelUpPopup, setLevelUpPopup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [isFetchingCep, setIsFetchingCep] = useState(false);
  const [hasErrorGlobal, setHasErrorGlobal] = useState(false);

  const DATA = useMemo(() => getData(lang), [lang]);
  const T = DATA.text;

  const [user, setUser] = useState({ name:'', xp:0, coupons:[], usedCoupons:[], hasSeenWelcome:false, ordersCount:92, lastActivity:new Date().toISOString() });
  const [booking, setBooking] = useState({ type:'single', cart:[], extras:{}, date:null, time:null, locationType:'home', address:{ cep:'', street:'', number:'', district:'', city:'', comp:'', placeName:'' }, payment:'', appliedCoupon:null, termsAccepted:false, bookingId:`BOOK_${Date.now()}`, mediaAllowed:false });

  const dateScrollRef = useRef(null);
  const reviewScrollRef = useRef(null);

  const addToast = useCallback((msg, type='success') => {
    const id = Date.now();
    setToasts(p => [...p.slice(-3), { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4500);
  }, []);

  const openExternal = useCallback((platform, text) => {
    const url = platform === 'whatsapp' ? `https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(text||'')}` : CONFIG.INSTAGRAM_URL;
    const a = document.createElement('a'); a.href=url; a.target='_blank'; a.rel='noopener noreferrer';
    document.body.appendChild(a); a.click(); setTimeout(() => document.body.removeChild(a), 100);
  }, []);

  useEffect(() => { setIsClient(true); cleanupStorage(); }, []);

  useEffect(() => {
    if (!isClient) return;
    let lu = {...user}, lb = {...booking}, ls = 0;
    try {
      const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.user && typeof parsed.user === 'object') {
          lu = { name: parsed.user.name||'', xp: typeof parsed.user.xp==='number' ? parsed.user.xp : 0, coupons: Array.isArray(parsed.user.coupons) ? parsed.user.coupons : [], usedCoupons: Array.isArray(parsed.user.usedCoupons) ? parsed.user.usedCoupons : [], hasSeenWelcome: !!parsed.user.hasSeenWelcome, ordersCount: typeof parsed.user.ordersCount==='number' ? Math.max(parsed.user.ordersCount,92) : 92, lastActivity: parsed.user.lastActivity||new Date().toISOString() };
        }
        if (parsed.bookingDraft && Array.isArray(parsed.bookingDraft.cart)) {
          const draftDate = parsed.bookingDraft.date ? new Date(parsed.bookingDraft.date) : null;
          if (!draftDate || draftDate > new Date()) {
            lb = { ...booking, ...parsed.bookingDraft, cart: parsed.bookingDraft.cart||[], extras: typeof parsed.bookingDraft.extras==='object' ? parsed.bookingDraft.extras : {}, mediaAllowed: !!parsed.bookingDraft.mediaAllowed, address: { cep: sanitizeInput(parsed.bookingDraft.address?.cep||''), street: sanitizeInput(parsed.bookingDraft.address?.street||''), number: sanitizeInput(parsed.bookingDraft.address?.number||''), district: sanitizeInput(parsed.bookingDraft.address?.district||''), city: sanitizeInput(parsed.bookingDraft.address?.city||''), comp: sanitizeInput(parsed.bookingDraft.address?.comp||''), placeName: sanitizeInput(parsed.bookingDraft.address?.placeName||'') } };
            if (typeof parsed.step==='number' && parsed.step>=0 && parsed.step<=4) ls = parsed.step;
          }
        }
      }
    } catch {}
    setUser(lu); setBooking(lb); setStep(ls); setDataLoaded(true);
    setTimeout(() => setLoading(false), 900);
  }, [isClient]);

  useEffect(() => {
    if (isClient && dataLoaded) {
      try {
        const save = { user: {...user, lastActivity: new Date().toISOString()}, bookingDraft: {...booking}, step };
        const s = JSON.stringify(save);
        if (s.length < CONFIG.MAX_STORAGE_SIZE*1024) localStorage.setItem(CONFIG.STORAGE_KEY, s);
      } catch {}
    }
  }, [user, booking, step, isClient, dataLoaded]);

  useEffect(() => {
    if (!loading && isClient && dataLoaded) {
      if (!user.hasSeenWelcome) { const t = setTimeout(() => setWelcomePopup(true), 2200); return () => clearTimeout(t); }
      else addToast(T.toast_loaded);
    }
  }, [loading, isClient, dataLoaded]);

  useEffect(() => { window.scrollTo({ top:0, behavior:'smooth' }); }, [step]);

  const handleToggleCartItem = useCallback((item) => {
    vibrate(50);
    setBooking(prev => {
      const exists = prev.cart.find(c => c.id===item.id);
      return { ...prev, cart: exists ? prev.cart.filter(c => c.id!==item.id) : [...prev.cart, item], payment:'', termsAccepted:false };
    });
    addToast(T.toast_cart_toggle);
  }, [addToast, T]);

  const handleCepChange = async (e) => {
    const masked = maskCEP(e.target.value);
    setBooking(b => ({ ...b, address: { ...b.address, cep: masked } }));
    if (masked.length === 9) {
      setIsFetchingCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${masked.replace('-','')}/json/`);
        const data = await res.json();
        if (!data.erro) { setBooking(b => ({ ...b, address: { ...b.address, cep: masked, street: data.logradouro||b.address.street, district: data.bairro||b.address.district, city: data.localidade||b.address.city } })); addToast(T.toast_cep_found); vibrate([50,50]); }
        else addToast(T.toast_cep_error, 'error');
      } catch {}
      finally { setIsFetchingCep(false); }
    }
  };

  const daysArray = useMemo(() => { const days=[],today=new Date(); for(let i=0;i<30;i++){const d=new Date(today);d.setDate(today.getDate()+i);days.push(d);} return days; }, []);

  const generateTimeSlots = useMemo(() => {
    if (!booking.date) return [];
    const slots=[]; for(let i=CONFIG.START_HOUR;i<=CONFIG.END_HOUR;i++) slots.push(`${i<10?'0':''}${i}:00`);
    const now=new Date(), sel=new Date(booking.date);
    if(isNaN(sel.getTime())) return [];
    if(sel.toDateString()===now.toDateString()){const cur=now.getHours();return slots.filter(t=>{const[h]=t.split(':').map(Number);return h>cur;});}
    return slots;
  }, [booking.date]);

  const groupedTimeSlots = useMemo(() => ({
    morning: generateTimeSlots.filter(t=>{ const h=parseInt(t); return h>=8&&h<12; }),
    afternoon: generateTimeSlots.filter(t=>{ const h=parseInt(t); return h>=12&&h<17; }),
    evening: generateTimeSlots.filter(t=>{ const h=parseInt(t); return h>=17&&h<=22; }),
  }), [generateTimeSlots]);

  const financials = useMemo(() => {
    if(booking.cart.length===0) return {total:0,sub:0,disc:0,pixDisc:0,mediaDisc:0,rushFee:0,duration:0};
    let sub=0,baseDuration=0;
    const isPack=booking.cart.some(i=>i.type==='pack');
    booking.cart.forEach(item=>{sub+=item.price;if(!isPack)baseDuration+=(item.min||60);});
    if(isPack) baseDuration=60;
    let addedTime=0;
    Object.keys(booking.extras||{}).forEach(k=>{
      if(booking.extras[k]){const ex=DATA.extras.find(e=>e.id===k);if(ex){sub+=isPack?Math.floor(ex.price*0.8):ex.price;if(ex.id==='more_time')addedTime+=30;}}
    });
    const duration=baseDuration+addedTime;
    const isRush=RUSH_HOURS.includes(booking.time||'');
    const rushFee=(isRush&&booking.locationType!=='motel')?RUSH_FEE:0;
    const disc=booking.appliedCoupon?booking.appliedCoupon.val:0;
    let running=Math.max(0,sub-disc);
    let mediaDisc=0;
    if(booking.mediaAllowed){mediaDisc=Math.ceil(running*0.01);running=Math.max(0,running-mediaDisc);}
    let pixDisc=0;
    if(booking.payment==='pix') pixDisc=Math.ceil(running*0.03);
    return {sub,disc,pixDisc,mediaDisc,rushFee,total:Math.max(0,running-pixDisc)+rushFee,duration};
  }, [booking.cart,booking.extras,booking.appliedCoupon,DATA.extras,booking.payment,booking.mediaAllowed,booking.time,booking.locationType]);

  const estimatedXP = useMemo(() => {
    const isPack=booking.cart.some(i=>i.type==='pack');
    return Math.floor(financials.total*(isPack?0.30:0.15));
  }, [financials.total,booking.cart]);

  const getCurrentLevelProgress = () => {
    if(user.xp>=800) return(((user.xp-800)%500)/500)*100;
    const rev=DATA.levels.slice().reverse().findIndex(l=>user.xp>=l.xpNeeded);
    const ri=rev===-1?0:DATA.levels.length-1-rev;
    const cur=DATA.levels[ri],next=DATA.levels[ri+1];
    if(!next) return 100;
    return Math.min(100,Math.max(0,((user.xp-cur.xpNeeded)/(next.xpNeeded-cur.xpNeeded))*100));
  };

  const getCurrentLevelTitle = () => {
    if(user.xp>=800) return "Plenitude Plus";
    return DATA.levels.slice().reverse().find(l=>user.xp>=l.xpNeeded)?.title||DATA.levels[0].title;
  };

  const getNextLevelInfo = () => {
    if(user.xp>=800){const need=500-((user.xp-800)%500);return{needed:need,reward:DATA.levels[3].reward};}
    const next=DATA.levels.find(l=>l.xpNeeded>user.xp);
    return next?{needed:next.xpNeeded-user.xp,reward:next.reward}:null;
  };

  const isStepValid = useCallback(() => {
    if(step===0) return booking.cart.length>0;
    if(step===1){if(!user.name||String(user.name).trim().length<3)return false;if(booking.locationType==='home')return validateAddress(booking.address);if(booking.locationType==='hotel')return !!(booking.address.placeName&&booking.address.city);return true;}
    if(step===2) return !!(booking.date&&booking.time);
    if(step===3) return !!(booking.payment&&booking.termsAccepted);
    return true;
  }, [step,booking,user.name]);

  const handleApplyCoupon = useCallback(() => {
    const code=couponInput.trim().toUpperCase();
    if(!code) return;
    const found=user.coupons.find(c=>c.code.toUpperCase()===code&&!user.usedCoupons.includes(c.code));
    if(found){setBooking(b=>({...b,appliedCoupon:found}));addToast(T.toast_coupon_success);setCouponInput('');vibrate(50);}
    else{addToast(T.toast_coupon_invalid,'error');vibrate([50,100,50]);}
  }, [couponInput,user.coupons,user.usedCoupons,T,addToast]);

  const handleNextStep = useCallback(() => {
    if(!isStepValid()){
      vibrate([50,50]); setHasErrorGlobal(true); setTimeout(()=>setHasErrorGlobal(false),600);
      const msgs={0:T.toast_select_item,1:!user.name||String(user.name).trim().length<3?T.toast_fill_name:T.toast_fill_addr,2:T.toast_select_date,3:T.toast_accept_terms};
      addToast(msgs[step]||'','error'); return;
    }
    vibrate(30);
    if(step===3) finishBooking(); else setStep(s=>s+1);
  }, [step,booking,user.name,T,addToast,isStepValid]);

  const generateWhatsAppMsg = () => {
    const f=financials;
    const dateStr=booking.date?new Date(booking.date).toLocaleDateString(lang==='en'?CONFIG.LOCALE_EN:CONFIG.LOCALE_PT):'';
    const hash=btoa(encodeURIComponent(`${f.total}-${dateStr}-${booking.cart[0]?.id||''}-${CONFIG.SECRET_TOKEN}`)).substring(0,8).toUpperCase();
    const isEn=lang==='en';
    const servicesText=booking.cart.map(item=>{const lines=item.details.split('\n').map(l=>`  • ${l}`).join('\n');return `✅ *${item.title}*\n_${item.desc}_\n*${isEn?'Details':'Detalhes'}:*\n${lines}`;}).join('\n\n');
    let locTxt='',mapQ='';
    if(booking.locationType==='home'){const a=`${booking.address.street}, ${booking.address.number} - ${booking.address.district}, ${booking.address.city}`;locTxt=`🏠 *${isEn?'Residence':'Residência'}*\n📍 ${a}\n📝 ${booking.address.comp||'-'}`;mapQ=a;}
    else if(booking.locationType==='motel') locTxt=`🏩 *${isEn?'My Suite':'Minha Suíte'}*\n⚠️ (${isEn?'Address confirmed on WhatsApp':'Endereço confirmado no WhatsApp'})`;
    else{const a=`${booking.address.placeName}, ${booking.address.city}`;locTxt=`🏨 *Hotel: ${booking.address.placeName}*\n📍 ${booking.address.city}\n🚪 ${isEn?'Room':'Quarto'}: ${booking.address.comp||'-'}`;mapQ=a;}
    const extrasList=Object.keys(booking.extras||{}).filter(k=>booking.extras[k]).map(k=>{const ex=DATA.extras.find(e=>e.id===k);return ex?`➕ ${ex.label}`:'';}).filter(Boolean).join('\n');
    let prices=`💵 *${isEn?'Subtotal':'Subtotal'}:* ${formatMoney(f.sub,lang)}`;
    if(f.disc>0) prices+=`\n🎁 *${booking.appliedCoupon?.code}:* -${formatMoney(f.disc,lang)}`;
    if(f.mediaDisc>0) prices+=`\n📸 *${isEn?'Portfolio':'Portfólio'}:* -${formatMoney(f.mediaDisc,lang)}`;
    if(f.pixDisc>0) prices+=`\n💸 *PIX (3%):* -${formatMoney(f.pixDisc,lang)}`;
    if(f.rushFee>0) prices+=`\n🚗 *${isEn?'Rush Fee':'Taxa Pico'}:* +${formatMoney(f.rushFee,lang)}`;
    prices+=`\n\n💰 *${isEn?'TOTAL':'TOTAL'}: ${formatMoney(f.total,lang)}*`;
    const mapLink=mapQ?`\n🔗 GPS: https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQ)}`:'';
    return (isEn?`*CARE RESERVATION* | #${hash}\n──────────────────\nHello Thalyson! I'd like to schedule my moment.\n\n👤 *Name:* ${sanitizeInput(user.name)}\n📅 *Date:* ${dateStr} at ${booking.time}\n⏱️ *Duration:* ${f.duration} min\n\n💆‍♂️ *WHAT I CHOSE:*\n${servicesText}\n\n${extrasList?`*Extras:*\n${extrasList}\n\n`:''}📍 *WHERE:*\n${locTxt}${mapLink}\n\n${booking.locationType!=='motel'?`⚠️ Travel fee (Uber) to be confirmed in chat.\n`:''}\n💰 *INVESTMENT:*\n${prices}\n\n💳 *Payment:* ${booking.payment.toUpperCase()}\n──────────────────\n_I accept the terms and await confirmation._`:`*PEDIDO DE ENCONTRO* | #${hash}\n──────────────────\nOlá Thalyson! Gostaria de agendar meu momento.\n\n👤 *Nome:* ${sanitizeInput(user.name)}\n📅 *Data:* ${dateStr} às ${booking.time}\n⏱️ *Tempo Estimado:* ${f.duration} min\n\n💆‍♂️ *O QUE EU ESCOLHI:*\n${servicesText}\n\n${extrasList?`*Extras Selecionados:*\n${extrasList}\n\n`:''}📍 *ONDE VAMOS NOS VER:*\n${locTxt}${mapLink}\n\n${booking.locationType!=='motel'?`⚠️ Taxa do Uber para eu ir até você será confirmada no chat.\n`:''}\n💰 *VALOR FINAL:*\n${prices}\n\n💳 *Pagamento escolhido:* ${booking.payment.toUpperCase()}\n──────────────────\n_Eu li e aceito as regras. Aguardo sua confirmação._`).trim();
  };

  const finishBooking = () => {
    vibrate([100,50,100,50,100]);
    let updatedCoupons=[...user.coupons],updatedHistory=[...user.usedCoupons];
    if(booking.appliedCoupon&&booking.appliedCoupon.id!=='manual'){if(!updatedHistory.includes(booking.appliedCoupon.code))updatedHistory.push(booking.appliedCoupon.code);updatedCoupons=updatedCoupons.filter(c=>c.code!==booking.appliedCoupon?.code);}
    const newXP=user.xp+estimatedXP;let leveledUp=false;
    DATA.levels.forEach(lvl=>{if(newXP>=lvl.xpNeeded&&user.xp<lvl.xpNeeded&&lvl.level>1){leveledUp=true;updatedCoupons.push({id:`LVL${lvl.level}_${Date.now()}`,val:lvl.reward,title:`🏆 ${lvl.title}`,code:`LVLUP${lvl.level}`});}});
    if(newXP>800){const oldL=Math.floor(Math.max(0,user.xp-800)/500),newL=Math.floor(Math.max(0,newXP-800)/500);if(newL>oldL){leveledUp=true;for(let i=oldL+1;i<=newL;i++)updatedCoupons.push({id:`LOOP_${i}_${Date.now()}`,val:DATA.levels[3].reward,title:`🏆 Plenitude Plus`,code:`PLUS${i}`});}}
    setUser(p=>({...p,xp:newXP,coupons:updatedCoupons,usedCoupons:updatedHistory,ordersCount:(p.ordersCount||92)+1,lastActivity:new Date().toISOString()}));
    if(leveledUp){setLevelUpPopup(true);setTimeout(()=>addToast(T.levelup_popup_title),500);}
    openExternal('whatsapp',generateWhatsAppMsg());
    setStep(4);
  };

  const scrollDates = (dir) => dateScrollRef.current?.scrollBy({ left: dir==='left'?-260:260, behavior:'smooth' });
  const getDayLabel = (d) => {
    const today=new Date(),tmrw=new Date(today);tmrw.setDate(today.getDate()+1);
    if(d.toDateString()===today.toDateString()) return T.today;
    if(d.toDateString()===tmrw.toDateString()) return T.tomorrow;
    return d.toLocaleDateString(lang==='en'?CONFIG.LOCALE_EN:CONFIG.LOCALE_PT,{weekday:'short'}).slice(0,3).toUpperCase();
  };

  const nextLevel=getNextLevelInfo();
  const categoryConfig=[
    {id:'relax',title:lang==='en'?"Just Relax":"Apenas Relaxar",icon:'sun',desc:lang==='en'?"Therapeutic body work.":"Tire a dor muscular e todo o estresse."},
    {id:'express',title:lang==='en'?"Express Care":"Cuidados Rápidos",icon:'watch',desc:lang==='en'?"Quick localized relief.":"Alívio rápido nas mãos e pés cansados."},
    {id:'final',title:lang==='en'?"With Ending":"Massagens com Finalização",icon:'sparkles',desc:lang==='en'?"A complete sensory journey.":"A jornada completa que termina com prazer."},
    {id:'care',title:lang==='en'?"Personal Care":"Cuidados Pessoais",icon:'scissors',desc:lang==='en'?"Aesthetic body maintenance.":"Manutenção para deixar seu corpo impecável."},
  ];

  // ── SURFACES ──
  const surface = { background: isDark ? 'rgba(255,255,255,0.03)' : '#fff', border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`, borderRadius:24, boxShadow: isDark ? 'none' : '0 1px 12px rgba(0,0,0,0.06)' };
  const surfacePad = { ...surface, padding:24 };

  if (!isClient) return <div style={{ minHeight:'100vh', background:'#08090e' }} />;

  if (loading) return (
    <div style={{ position:'fixed', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background: isDark ? '#08090e' : '#f4f3ef', zIndex:100 }}>
      <GlobalStyles isDark={isDark} />
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', width:240 }}>
        <div style={{ position:'relative', marginBottom:40 }}>
          <div style={{ position:'absolute', inset:0, background:'rgba(59,130,246,0.18)', borderRadius:'50%', filter:'blur(24px)', transform:'scale(1.8)', animation:'pulse 2s ease-in-out infinite' }} />
          <div style={{ position:'relative', width:80, height:80, borderRadius:28, background:'linear-gradient(135deg,#2563eb,#3b82f6)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 20px 60px rgba(59,130,246,0.35)', border:'1px solid rgba(96,165,250,0.25)' }}>
            <span style={{ fontSize:38, fontWeight:800, color:'#fff', fontFamily:'Poppins,sans-serif' }}>T</span>
          </div>
        </div>
        <div style={{ width:'100%', height:2, borderRadius:2, background:'rgba(255,255,255,0.06)', overflow:'hidden', marginBottom:20 }}>
          <div className="loading-bar-anim" style={{ height:'100%', background:'linear-gradient(90deg,#2563eb,#60a5fa,#2563eb)', width:'50%' }} />
        </div>
        <p className="label-micro" style={{ color: isDark ? '#4a4640' : '#9a9590', letterSpacing:'0.2em' }}>{T.loading}</p>
      </div>
    </div>
  );

  return (
    <>
      <GlobalStyles isDark={isDark} />

      {/* Background */}
      <div style={{ position:'fixed', inset:0, zIndex:-1, background: isDark ? '#08090e' : '#f4f3ef', transition:'background 0.4s' }} />
      {isDark && (
        <div style={{ position:'fixed', inset:0, zIndex:-1, overflow:'hidden', pointerEvents:'none' }}>
          <div style={{ position:'absolute', top:'-10%', left:'30%', width:480, height:480, background:'rgba(59,130,246,0.04)', borderRadius:'50%', filter:'blur(80px)' }} />
          <div style={{ position:'absolute', bottom:'20%', right:'20%', width:320, height:320, background:'rgba(99,102,241,0.03)', borderRadius:'50%', filter:'blur(60px)' }} />
        </div>
      )}

      <ToastContainer toasts={toasts} isDark={isDark} />
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} isDark={isDark} toggleTheme={() => setIsDark(p=>!p)} user={user} T={T} />

      <main style={{ minHeight:'100vh', paddingBottom:180, paddingLeft:16, paddingRight:16, maxWidth:900, margin:'0 auto', position:'relative', zIndex:10 }}>

        {/* ── HEADER ── */}
        {step !== 4 && (
          <header style={{ paddingTop:36, paddingBottom:28 }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16 }}>
              <button onClick={() => setStep(0)} style={{ background:'none', border:'none', textAlign:'left', cursor:'pointer', padding:0 }}>
                <h1 style={{ fontSize:26, fontWeight:800, margin:'0 0 6px', letterSpacing:'-0.02em', color: isDark ? '#edeae4' : '#1a1714', lineHeight:1.1 }}>
                  Thalyson Massagens
                </h1>
                <div style={{ display:'flex', alignItems:'center', gap:8 }} className="label-micro" style={{ color: isDark ? '#4a4640' : '#9a9590', display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ position:'relative', display:'inline-flex', width:8, height:8 }}>
                    <span className="animate-ping" style={{ position:'absolute', inset:0, borderRadius:'50%', background:'#60a5fa', opacity:0.75 }} />
                    <span style={{ position:'relative', width:8, height:8, borderRadius:'50%', background:'#3b82f6', display:'block' }} />
                  </span>
                  <span className="label-micro" style={{ color: isDark ? '#4a4640' : '#9a9590' }}>
                    +{user.ordersCount} {T.header_tensions}
                  </span>
                </div>
              </button>

              <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                {/* Lang toggle */}
                <button onClick={() => setLang(l => l==='pt'?'en':'pt')} style={{ position:'relative', width:38, height:38, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:12, border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', color: isDark ? '#7c7770' : '#64748b', transition:'all 0.2s' }}>
                  <Icon name="globe" size={17} />
                  <span style={{ position:'absolute', bottom:-5, right:-5, fontSize:7, fontWeight:700, background:'#3b82f6', color:'#fff', padding:'2px 4px', borderRadius:6, lineHeight:1.2 }}>{lang.toUpperCase()}</span>
                </button>
                {/* Instagram */}
                <button onClick={() => openExternal('instagram')} style={{ width:38, height:38, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:12, border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', color:'#f472b6', transition:'all 0.2s' }}>
                  <Icon name="instagram" size={17} />
                </button>
                {/* Menu */}
                <button onClick={() => setMenuOpen(true)} style={{ width:38, height:38, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:12, border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', color: isDark ? '#7c7770' : '#64748b', transition:'all 0.2s' }}>
                  <Icon name="menu" size={17} />
                </button>
              </div>
            </div>

            {/* Step progress */}
            {step > 0 && step < 4 && (
              <div style={{ marginTop:32, display:'flex', alignItems:'center', gap:8 }}>
                {[1,2,3].map(i => (
                  <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6, cursor: i < step ? 'pointer' : 'default' }} onClick={() => { if(i<step) setStep(i); }}>
                    <div style={{ width:'100%', height:3, borderRadius:3, transition:'all 0.5s ease', background: step>i ? '#3b82f6' : step===i ? '#60a5fa' : isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)', boxShadow: step===i ? '0 0 10px rgba(59,130,246,0.5)' : 'none' }} />
                    <span className="label-micro" style={{ fontSize:10, color: step>=i ? (isDark ? 'rgba(237,234,228,0.7)' : '#64748b') : (isDark ? 'rgba(255,255,255,0.2)' : '#cbd5e1') }}>
                      {i===1 ? T.step_where : i===2 ? T.step_when : T.step_summary}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </header>
        )}

        {/* ═══════════════════════════════
            STEP 0 — SERVICES
        ═══════════════════════════════ */}
        {step === 0 && (
          <section className="animate-fade-up" style={{ display:'flex', flexDirection:'column', gap:56 }}>

            {/* Hero grid */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:24, alignItems:'center' }}>
              <div>
                <h2 style={{ fontSize:36, fontWeight:800, lineHeight:1.1, margin:'0 0 16px', color: isDark ? '#edeae4' : '#1a1714' }}>
                  {T.welcome}{' '}
                  <em style={{ fontStyle:'italic', background:'linear-gradient(135deg,#60a5fa,#818cf8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                    {user.name ? String(user.name).trim().split(' ')[0] : T.welcome_anon}
                  </em>
                </h2>
                <p style={{ fontSize:15, lineHeight:1.8, maxWidth:440, margin:0, color: isDark ? '#7c7770' : '#64748b' }}>{T.choose_sub}</p>
              </div>

              {/* XP Level Card */}
              <div style={{ ...surfacePad, position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:'-30%', right:'-10%', width:180, height:180, background:'rgba(59,130,246,0.05)', borderRadius:'50%', filter:'blur(24px)', pointerEvents:'none' }} />
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20, position:'relative' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:44, height:44, borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', background: isDark ? 'rgba(245,158,11,0.12)' : '#fffbeb', border: `1px solid ${isDark ? 'rgba(245,158,11,0.2)' : '#fde68a'}`, color:'#f59e0b' }}>
                      <Icon name="award" size={22} />
                    </div>
                    <div>
                      <p className="label-micro" style={{ color: isDark ? '#5c5850' : '#9a9590', marginBottom:3 }}>{T.level_label}</p>
                      <h3 style={{ fontSize:15, fontWeight:700, margin:0, color: isDark ? '#edeae4' : '#1e293b' }}>{getCurrentLevelTitle()}</h3>
                    </div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <span style={{ fontSize:38, fontWeight:800, lineHeight:1, background:'linear-gradient(135deg,#60a5fa,#818cf8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>{user.xp}</span>
                    <p className="label-micro" style={{ color: isDark ? '#5c5850' : '#9a9590', marginTop:2 }}>{T.level_current}</p>
                  </div>
                </div>
                <div style={{ position:'relative' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                    <span className="label-micro" style={{ color: isDark ? '#5c5850' : '#9a9590' }}>{T.level_journey}</span>
                    <span className="label-micro" style={{ color: isDark ? '#5c5850' : '#9a9590' }}>{Math.floor(getCurrentLevelProgress())}%</span>
                  </div>
                  <div style={{ height:6, borderRadius:6, background: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9', overflow:'hidden' }}>
                    <div style={{ height:'100%', background:'linear-gradient(90deg,#2563eb,#60a5fa)', borderRadius:6, transition:'width 1s ease', width:`${getCurrentLevelProgress()}%` }} />
                  </div>
                  {nextLevel && (
                    <p style={{ fontSize:13, marginTop:12, textAlign:'center', color: isDark ? '#5c5850' : '#94a3b8' }}>
                      {T.msg_level_keep1} <strong style={{ color: isDark ? '#edeae4' : '#334155' }}>{nextLevel.needed} XP</strong> {T.msg_level_keep2} <span style={{ color:'#60a5fa' }}>{formatMoney(nextLevel.reward, lang)}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Tab switcher */}
            <div style={{ display:'flex', justifyContent:'center' }}>
              <div style={{ display:'flex', padding:6, borderRadius:20, background: isDark ? 'rgba(255,255,255,0.04)' : '#f1f5f9', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}` }}>
                {[{id:'single',label:T.tab_single,icon:'user'},{id:'packs',label:T.tab_packs,icon:'package'}].map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                    display:'flex', alignItems:'center', gap:8, padding:'10px 24px', borderRadius:14,
                    fontSize:12, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase',
                    transition:'all 0.3s ease',
                    background: activeTab===tab.id ? (tab.id==='packs' ? '#f59e0b' : '#3b82f6') : 'transparent',
                    color: activeTab===tab.id ? (tab.id==='packs' ? '#1a1714' : '#fff') : (isDark ? '#5c5850' : '#94a3b8'),
                    boxShadow: activeTab===tab.id ? '0 4px 16px rgba(0,0,0,0.2)' : 'none',
                  }}>
                    <Icon name={tab.icon} size={15} />{tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Services content */}
            <div className="tab-content">
              {activeTab === 'single' ? (
                <div style={{ display:'flex', flexDirection:'column', gap:32 }}>
                  {categoryConfig.map(cat => {
                    const services = DATA.services.filter(s => s.category===cat.id);
                    if (!services.length) return null;
                    const cfg = CATEGORY_CONFIG[cat.id];
                    const selectedCount = booking.cart.filter(c => c.category===cat.id).length;
                    return (
                      <div key={cat.id} style={{ borderRadius:28, overflow:'hidden', border: `1.5px solid ${cfg.borderColor}`, background: isDark ? cfg.bg : cfg.lightBg }}>
                        {/* Category header */}
                        <div style={{ padding:'20px 24px', display:'flex', alignItems:'center', gap:16, borderBottom: `1px solid ${cfg.borderColor}` }}>
                          <div style={{ width:48, height:48, borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, background: `${cfg.color}18`, border: `1px solid ${cfg.color}28` }}>
                            <Icon name={cat.icon} size={24} style={{ color: cfg.color }} />
                          </div>
                          <div style={{ flex:1 }}>
                            <h3 style={{ fontSize:20, fontWeight:700, margin:'0 0 3px', color: isDark ? '#edeae4' : '#1e293b' }}>{cat.title}</h3>
                            <p style={{ fontSize:13, margin:0, color: isDark ? '#5c5850' : '#94a3b8' }}>{cat.desc}</p>
                          </div>
                          {selectedCount > 0 && (
                            <div style={{ width:28, height:28, borderRadius:'50%', background: cfg.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#fff', flexShrink:0 }}>{selectedCount}</div>
                          )}
                        </div>
                        {/* Grid */}
                        <div style={{ padding:20, display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
                          {services.map(s => (
                            <ServiceCard key={s.id} service={s} isInCart={booking.cart.some(c=>c.id===s.id)} onToggle={handleToggleCartItem} isDark={isDark} T={T} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:20 }}>
                  {DATA.plans.map(s => {
                    const isInCart = booking.cart.some(c=>c.id===s.id);
                    return (
                      <div key={s.id} className="card-hover" style={{ position:'relative', borderRadius:24, border: `1.5px solid ${isInCart ? '#f59e0b' : isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`, background: isInCart ? 'rgba(245,158,11,0.05)' : isDark ? 'rgba(255,255,255,0.03)' : '#fff', boxShadow: isInCart ? '0 0 0 1px rgba(245,158,11,0.4),0 8px 32px rgba(245,158,11,0.18)' : isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.06)', cursor:'pointer', overflow:'hidden', transition:'all 0.3s ease' }} onClick={() => handleToggleCartItem(s)}>
                        {isInCart && (
                          <div className="animate-check-pop" style={{ position:'absolute', top:16, right:16, zIndex:10, width:26, height:26, borderRadius:'50%', background:'#f59e0b', color:'#1a1714', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <Icon name="check" size={14} />
                          </div>
                        )}
                        <div style={{ padding:24 }}>
                          <div style={{ width:44, height:44, borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16, background: isDark ? 'rgba(245,158,11,0.1)' : '#fffbeb', border: `1px solid ${isDark ? 'rgba(245,158,11,0.2)' : '#fde68a'}`, color:'#f59e0b' }}>
                            <Icon name={s.icon} size={22} />
                          </div>
                          <span style={{ padding:'4px 10px', borderRadius:999, fontSize:10, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', background: isDark ? 'rgba(245,158,11,0.1)' : '#fffbeb', border: `1px solid ${isDark ? 'rgba(245,158,11,0.2)' : '#fde68a'}`, color: isDark ? '#fbbf24' : '#d97706', display:'inline-block', marginBottom:12 }}>{s.tag}</span>
                          <h3 style={{ fontSize:18, fontWeight:700, margin:'0 0 8px', color: isDark ? '#edeae4' : '#1e293b', lineHeight:1.3 }}>{s.title}</h3>
                          <p style={{ fontSize:13, lineHeight:1.8, margin:'0 0 20px', color: isDark ? '#7c7770' : '#64748b' }}>{s.desc}</p>
                          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', borderTop: `1px solid ${isDark ? 'rgba(245,158,11,0.15)' : 'rgba(245,158,11,0.12)'}`, paddingTop:16 }}>
                            <div>
                              {s.fullPrice && <p style={{ fontSize:11, textDecoration:'line-through', margin:'0 0 2px', color: isDark ? '#4a4640' : '#94a3b8' }}>{T.from} {formatMoney(s.fullPrice,'pt')}</p>}
                              <p style={{ fontSize:26, fontWeight:800, lineHeight:1, margin:0, color: isDark ? '#edeae4' : '#1a1714' }}>{formatMoney(s.price,'pt')}</p>
                            </div>
                            {s.savings && <span style={{ padding:'4px 10px', borderRadius:999, fontSize:10, fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', background: isDark ? 'rgba(16,185,129,0.1)' : '#ecfdf5', border: `1px solid ${isDark ? 'rgba(16,185,129,0.2)' : '#6ee7b7'}`, color: isDark ? '#34d399' : '#059669' }}>{T.savings} {formatMoney(s.savings,'pt')}</span>}
                          </div>
                          <div style={{ marginTop:16, display:'flex', flexDirection:'column', gap:6 }}>
                            {s.details.split('\n').map((line,i) => (
                              <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:8 }}>
                                <span style={{ fontSize:11, fontWeight:700, marginTop:2, flexShrink:0, color:'#f59e0b' }}>→</span>
                                <span style={{ fontSize:12, lineHeight:1.7, color: isDark ? '#7c7770' : '#64748b' }}>{line}</span>
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
            <div style={{ paddingTop:40, paddingBottom:40, borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : '#f1f5f9'}`, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : '#f1f5f9'}` }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }}>
                <h3 style={{ fontSize:24, fontWeight:700, margin:0, color: isDark ? '#edeae4' : '#1e293b' }}>{T.reviews_title}</h3>
                <div style={{ display:'flex', gap:8 }}>
                  {['chevron-left','chevron-right'].map((dir,i) => (
                    <button key={dir} onClick={() => reviewScrollRef.current?.scrollBy({ left: i===0?-340:340, behavior:'smooth' })} style={{ width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:10, border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`, background: isDark ? 'rgba(255,255,255,0.04)' : '#fff', color: isDark ? '#7c7770' : '#94a3b8', transition:'all 0.2s' }}>
                      <Icon name={dir} size={17} />
                    </button>
                  ))}
                </div>
              </div>
              <div ref={reviewScrollRef} className="scrollbar-hide" style={{ display:'flex', overflowX:'auto', gap:16, paddingBottom:8, scrollSnapType:'x mandatory', margin:'0 -16px', padding:'0 16px 8px' }}>
                {DATA.reviews.map((r,i) => (
                  <div key={i} style={{ scrollSnapAlign:'center', flexShrink:0, width:'78vw', maxWidth:320 }}>
                    <ReviewCard review={r} isDark={isDark} />
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div style={{ maxWidth:660, margin:'0 auto', paddingBottom:16 }}>
              <h3 style={{ fontSize:26, fontWeight:700, textAlign:'center', margin:'0 0 32px', color: isDark ? '#edeae4' : '#1e293b' }}>{T.faq_title}</h3>
              <div style={{ ...surface, padding:'0 24px', overflow:'hidden' }}>
                {DATA.faq.map((item,idx) => <FAQItem key={idx} q={item.q} a={item.a} isDark={isDark} />)}
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════
            STEP 1 — WHERE
        ═══════════════════════════════ */}
        {step === 1 && (
          <section className="animate-fade-up" style={{ maxWidth:540, margin:'0 auto', display:'flex', flexDirection:'column', gap:28 }}>
            <div style={{ textAlign:'center' }}>
              <h2 style={{ fontSize:30, fontWeight:800, margin:'0 0 8px', color: isDark ? '#edeae4' : '#1e293b' }}>{T.location_title}</h2>
              <p style={{ fontSize:14, margin:0, color: isDark ? '#5c5850' : '#94a3b8' }}>{lang==='en'?'I come to you':'Eu vou até o seu local'}</p>
            </div>

            {/* Location type */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
              {[
                {id:'home',label:T.loc_home,icon:'home',desc:lang==='en'?'Your place':'Na sua casa'},
                {id:'motel',label:T.loc_motel,icon:'bed',desc:lang==='en'?'Private suite':'Suíte privada'},
                {id:'hotel',label:T.loc_hotel,icon:'building',desc:lang==='en'?'Your hotel':'No seu hotel'},
              ].map(x => (
                <button key={x.id} onClick={() => setBooking(b=>({...b,locationType:x.id}))} style={{
                  padding:'18px 8px', borderRadius:20, display:'flex', flexDirection:'column', alignItems:'center', gap:8, transition:'all 0.3s',
                  background: booking.locationType===x.id ? '#3b82f6' : isDark ? 'rgba(255,255,255,0.04)' : '#fff',
                  border: `1.5px solid ${booking.locationType===x.id ? '#60a5fa' : isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
                  color: booking.locationType===x.id ? '#fff' : isDark ? '#7c7770' : '#94a3b8',
                  boxShadow: booking.locationType===x.id ? '0 8px 24px rgba(59,130,246,0.3)' : 'none',
                }}>
                  <Icon name={x.icon} size={24} />
                  <span style={{ fontSize:11, fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', lineHeight:1.3, textAlign:'center' }}>{x.label}</span>
                  <span style={{ fontSize:10, opacity:0.7, textAlign:'center' }}>{x.desc}</span>
                </button>
              ))}
            </div>

            {/* Form */}
            <div style={{ ...surfacePad, display:'flex', flexDirection:'column', gap:18 }}>
              <InputField isDark={isDark} label={T.input_name} value={user.name} onChange={e => setUser(u=>({...u,name:sanitizeInput(e.target.value)}))} icon="user" placeholder={lang==='en'?"Your name":"Como quer ser chamado?"} hasError={hasErrorGlobal&&(!user.name||String(user.name).trim().length<3)} />

              {booking.locationType === 'home' && (
                <div className="animate-fade-up" style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  <InputField isDark={isDark} label={T.input_cep} value={booking.address.cep||''} onChange={handleCepChange} icon="map-pin" placeholder="00000-000" type="tel" maxLength={9} disabled={isFetchingCep} hasError={hasErrorGlobal&&!booking.address.street} />
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 96px', gap:12 }}>
                    <InputField isDark={isDark} label={T.input_addr} value={booking.address.street} onChange={e=>setBooking(b=>({...b,address:{...b.address,street:sanitizeInput(e.target.value)}}))} placeholder={lang==='en'?"Street / Avenue":"Rua / Avenida"} disabled={isFetchingCep} hasError={hasErrorGlobal&&!booking.address.street} />
                    <InputField isDark={isDark} label={T.input_num} value={booking.address.number} onChange={e=>setBooking(b=>({...b,address:{...b.address,number:sanitizeInput(e.target.value)}}))} placeholder="Nº" type="tel" hasError={hasErrorGlobal&&!booking.address.number} />
                  </div>
                  <InputField isDark={isDark} label={T.input_district} value={booking.address.district} onChange={e=>setBooking(b=>({...b,address:{...b.address,district:sanitizeInput(e.target.value)}}))} placeholder={lang==='en'?"Neighborhood":"Nome do Bairro"} disabled={isFetchingCep} hasError={hasErrorGlobal&&!booking.address.district} />
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                    <InputField isDark={isDark} label={T.input_city} value={booking.address.city} onChange={e=>setBooking(b=>({...b,address:{...b.address,city:sanitizeInput(e.target.value)}}))} placeholder={lang==='en'?"City":"Nome da Cidade"} disabled={isFetchingCep} hasError={hasErrorGlobal&&!booking.address.city} />
                    <InputField isDark={isDark} label={T.input_comp} value={booking.address.comp} onChange={e=>setBooking(b=>({...b,address:{...b.address,comp:sanitizeInput(e.target.value)}}))} placeholder={lang==='en'?"Apt (Optional)":"Apto (Opcional)"} />
                  </div>
                </div>
              )}

              {booking.locationType === 'hotel' && (
                <div className="animate-fade-up" style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  <InputField isDark={isDark} label={T.input_hotel} value={booking.address.placeName} onChange={e=>setBooking(b=>({...b,address:{...b.address,placeName:sanitizeInput(e.target.value)}}))} icon="building" placeholder={lang==='en'?"Hotel name":"Nome completo do Hotel"} hasError={hasErrorGlobal&&!booking.address.placeName} />
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                    <InputField isDark={isDark} label={T.input_city} value={booking.address.city} onChange={e=>setBooking(b=>({...b,address:{...b.address,city:sanitizeInput(e.target.value)}}))} placeholder={lang==='en'?"City":"Cidade do Hotel"} hasError={hasErrorGlobal&&!booking.address.city} />
                    <InputField isDark={isDark} label={T.input_room} value={booking.address.comp} onChange={e=>setBooking(b=>({...b,address:{...b.address,comp:sanitizeInput(e.target.value)}}))} placeholder={lang==='en'?"Room Nº":"Nº do Quarto"} />
                  </div>
                </div>
              )}

              {booking.locationType === 'motel' && (
                <div className="animate-fade-up" style={{ display:'flex', alignItems:'flex-start', gap:16, padding:18, borderRadius:18, background: isDark ? 'rgba(244,63,94,0.05)' : '#fff1f2', border: `1px solid ${isDark ? 'rgba(244,63,94,0.2)' : '#fecdd3'}` }}>
                  <div style={{ flexShrink:0, width:44, height:44, borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', background: isDark ? 'rgba(244,63,94,0.1)' : '#ffe4e6', color:'#f43f5e' }}>
                    <Icon name="heart" size={20} />
                  </div>
                  <p style={{ fontSize:14, lineHeight:1.75, margin:0, color: isDark ? '#c8c4be' : '#4b4744' }}>{T.motel_note}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ═══════════════════════════════
            STEP 2 — WHEN
        ═══════════════════════════════ */}
        {step === 2 && (
          <section className="animate-fade-up" style={{ maxWidth:680, margin:'0 auto', display:'flex', flexDirection:'column', gap:28 }}>
            <div style={{ textAlign:'center' }}>
              <h2 style={{ fontSize:30, fontWeight:800, margin:'0 0 8px', color: isDark ? '#edeae4' : '#1e293b' }}>{T.select_time_title}</h2>
            </div>

            {/* Cart mini */}
            <div style={{ ...surfacePad, padding:'16px 20px' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                <span className="label-micro" style={{ color: isDark ? '#5c5850' : '#94a3b8' }}>{T.cart_title}</span>
                <button onClick={() => setStep(0)} style={{ fontSize:11, fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', padding:'4px 12px', borderRadius:10, border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`, color: isDark ? '#7c7770' : '#94a3b8', background:'transparent', transition:'all 0.2s' }}>{T.cart_edit}</button>
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {booking.cart.map(item => (
                  <span key={item.id} style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:13, fontWeight:500, padding:'6px 12px', borderRadius:12, background: isDark ? 'rgba(59,130,246,0.1)' : '#eff6ff', border: `1px solid ${isDark ? 'rgba(59,130,246,0.2)' : '#bfdbfe'}`, color: isDark ? '#60a5fa' : '#3b82f6' }}>
                    <Icon name={item.icon} size={13} isEmoji={item.isEmoji} />
                    {item.title.split(' ').slice(0,2).join(' ')}
                  </span>
                ))}
              </div>
            </div>

            {/* Date scroll */}
            <div style={{ position:'relative' }}>
              <div ref={dateScrollRef} className="scrollbar-hide" style={{ display:'flex', gap:10, overflowX:'auto', scrollSnapType:'x mandatory', padding:'8px 4px 12px' }}>
                {daysArray.map((d,idx) => {
                  const isSel = booking.date && new Date(booking.date).toDateString()===d.toDateString();
                  const mo = d.toLocaleDateString(lang==='en'?CONFIG.LOCALE_EN:CONFIG.LOCALE_PT,{month:'short'}).replace('.','');
                  return (
                    <button key={idx} onClick={() => { setBooking(b=>({...b,date:d.toISOString(),time:null})); vibrate(30); }} style={{
                      scrollSnapAlign:'center', flexShrink:0, width:66, height:90, borderRadius:20, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:4, transition:'all 0.3s ease',
                      background: isSel ? '#3b82f6' : isDark ? 'rgba(255,255,255,0.04)' : '#fff',
                      border: `1.5px solid ${isSel ? '#60a5fa' : isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
                      color: isSel ? '#fff' : isDark ? '#7c7770' : '#94a3b8',
                      boxShadow: isSel ? '0 8px 24px rgba(59,130,246,0.3)' : isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.05)',
                      transform: isSel ? 'scale(1.06)' : 'scale(1)',
                    }}>
                      <span style={{ fontSize:9, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', opacity: isSel ? 0.85 : 1 }}>{mo}</span>
                      <span style={{ fontSize:26, fontWeight:800, lineHeight:1, color: isSel ? '#fff' : isDark ? '#edeae4' : '#1e293b' }}>{d.getDate()}</span>
                      <span style={{ fontSize:9, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', opacity: isSel ? 0.85 : 1 }}>{getDayLabel(d)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* No date */}
            {!booking.date && (
              <div className={hasErrorGlobal ? 'animate-shake' : ''} style={{ textAlign:'center', padding:'56px 24px', borderRadius:24, border: `2px dashed ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`, display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
                <Icon name="calendar" size={36} style={{ color: isDark ? '#2a2820' : '#e2e8f0' }} />
                <p className="label-micro" style={{ color: isDark ? '#4a4640' : '#cbd5e1' }}>{T.empty_date}</p>
              </div>
            )}

            {/* Time slots */}
            {booking.date && generateTimeSlots.length > 0 && (
              <div className={`animate-fade-up${hasErrorGlobal&&!booking.time?' animate-shake':''}`} style={{ display:'flex', flexDirection:'column', gap:20 }}>
                {[
                  {key:'morning',label:T.morning,icon:'sunrise',slots:groupedTimeSlots.morning},
                  {key:'afternoon',label:T.afternoon,icon:'sun',slots:groupedTimeSlots.afternoon},
                  {key:'evening',label:T.evening,icon:'sunset',slots:groupedTimeSlots.evening},
                ].filter(g => g.slots.length>0).map(group => (
                  <div key={group.key}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }} className="label-micro">
                      <Icon name={group.icon} size={13} style={{ color: isDark ? '#5c5850' : '#94a3b8' }} />
                      <span className="label-micro" style={{ color: isDark ? '#5c5850' : '#94a3b8' }}>{group.label}</span>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(72px,1fr))', gap:8 }}>
                      {group.slots.map(t => {
                        const isRush = RUSH_HOURS.includes(t) && booking.locationType!=='motel';
                        const isSel = booking.time===t;
                        return (
                          <button key={t} onClick={() => { setBooking(b=>({...b,time:t})); vibrate(30); }} style={{
                            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'10px 4px', borderRadius:14, fontSize:14, fontWeight:600, lineHeight:1.2, transition:'all 0.2s',
                            background: isSel ? (isRush ? '#f59e0b' : '#3b82f6') : isDark ? (isRush ? 'rgba(245,158,11,0.07)' : 'rgba(255,255,255,0.05)') : (isRush ? '#fffbeb' : '#fff'),
                            border: `1.5px solid ${isSel ? (isRush ? '#fbbf24' : '#60a5fa') : isDark ? (isRush ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.08)') : (isRush ? '#fde68a' : '#e2e8f0')}`,
                            color: isSel ? (isPremium => '#fff')() : isDark ? (isRush ? '#fbbf24' : '#c8c4be') : (isRush ? '#d97706' : '#64748b'),
                            transform: isSel ? 'scale(1.06)' : 'scale(1)',
                            boxShadow: isSel ? `0 6px 18px ${isRush ? 'rgba(245,158,11,0.3)' : 'rgba(59,130,246,0.28)'}` : 'none',
                          }}>
                            {t}
                            {isRush && <span style={{ fontSize:9, fontWeight:600, marginTop:2, opacity: isSel ? 0.85 : 1 }}>+R$15</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {Object.values(groupedTimeSlots).flat().some(t=>RUSH_HOURS.includes(t)) && booking.locationType!=='motel' && (
                  <div style={{ display:'flex', alignItems:'flex-start', gap:12, padding:14, borderRadius:16, fontSize:13, lineHeight:1.7, background: isDark ? 'rgba(245,158,11,0.06)' : '#fffbeb', border: `1px solid ${isDark ? 'rgba(245,158,11,0.18)' : '#fde68a'}`, color: isDark ? '#fbbf24' : '#92400e' }}>
                    <Icon name="alert-circle" size={15} style={{ flexShrink:0, marginTop:2 }} />
                    <p style={{ margin:0 }}>{lang==='en'?'Rush hour slots include a small R$ 15 displacement fee.':'Você selecionou um horário de pico (meio-dia/fim de tarde). Ele tem uma pequena taxa de R$ 15 de deslocamento.'}</p>
                  </div>
                )}
              </div>
            )}

            {booking.date && generateTimeSlots.length===0 && (
              <div style={{ textAlign:'center', padding:'52px 24px', borderRadius:24, border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9'}`, color: isDark ? '#4a4640' : '#94a3b8' }}>
                <p style={{ fontSize:14, fontWeight:500, margin:0 }}>{T.empty_slots}</p>
              </div>
            )}
          </section>
        )}

        {/* ═══════════════════════════════
            STEP 3 — SUMMARY & PAYMENT
        ═══════════════════════════════ */}
        {step === 3 && (
          <section className="animate-fade-up" style={{ display:'flex', flexDirection:'column', gap:20, maxWidth:960, margin:'0 auto' }}>
            <SmartTimer isDark={isDark} text={T.timer_text} />

            {/* Extras */}
            <div style={{ ...surfacePad }}>
              <h3 style={{ fontSize:20, fontWeight:700, margin:'0 0 4px', color: isDark ? '#edeae4' : '#1e293b' }}>{T.extras_title}</h3>
              <p style={{ fontSize:13, margin:'0 0 20px', color: isDark ? '#5c5850' : '#94a3b8', lineHeight:1.7 }}>{lang==='en'?'Optional add-ons for your experience.':'Deseja adicionar algo extra para deixar a experiência mais completa?'}</p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))', gap:12 }}>
                {DATA.extras.map(ex => {
                  const price = booking.cart.some(i=>i.type==='pack') ? Math.floor(ex.price*0.8) : ex.price;
                  const isActive = booking.extras[ex.id];
                  return (
                    <div key={ex.id} onClick={() => { setBooking(b=>({...b,extras:{...b.extras,[ex.id]:!b.extras[ex.id]}})); vibrate(30); }} role="checkbox" aria-checked={isActive} style={{
                      display:'flex', alignItems:'flex-start', justifyContent:'space-between', padding:16, borderRadius:18, cursor:'pointer', transition:'all 0.2s',
                      background: isActive ? (isDark ? 'rgba(59,130,246,0.1)' : '#eff6ff') : isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                      border: `1.5px solid ${isActive ? (isDark ? 'rgba(59,130,246,0.4)' : '#bfdbfe') : isDark ? 'rgba(255,255,255,0.07)' : '#f1f5f9'}`,
                    }}>
                      <div style={{ display:'flex', alignItems:'flex-start', gap:12, minWidth:0, paddingRight:12 }}>
                        <span style={{ fontSize:20, marginTop:2, flexShrink:0 }}>{ex.icon}</span>
                        <div>
                          <p style={{ fontSize:14, fontWeight:600, margin:'0 0 4px', color: isActive ? (isDark ? '#60a5fa' : '#3b82f6') : isDark ? '#c8c4be' : '#334155' }}>{ex.label}</p>
                          <p style={{ fontSize:12, margin:0, lineHeight:1.65, color: isDark ? '#5c5850' : '#94a3b8' }}>{ex.desc}</p>
                        </div>
                      </div>
                      <span style={{ fontSize:11, fontWeight:700, padding:'6px 10px', borderRadius:10, whiteSpace:'nowrap', flexShrink:0, alignSelf:'flex-start', transition:'all 0.2s', background: isActive ? '#3b82f6' : isDark ? 'rgba(255,255,255,0.07)' : '#f1f5f9', color: isActive ? '#fff' : isDark ? '#7c7770' : '#94a3b8' }}>
                        +{formatMoney(price,lang)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Main grid */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:20 }}>
              {/* ─ ORDER SUMMARY ─ */}
              <div style={{ ...surfacePad }}>
                <h3 style={{ fontSize:20, fontWeight:700, margin:'0 0 24px', color: isDark ? '#edeae4' : '#1e293b', display:'flex', alignItems:'center', gap:10 }}>
                  <Icon name="file-text" size={20} style={{ color: isDark ? '#4a4640' : '#94a3b8' }} />
                  {T.summary_title}
                </h3>

                {/* Services */}
                <div style={{ marginBottom:20 }}>
                  <p className="label-micro" style={{ color: isDark ? '#4a4640' : '#94a3b8', marginBottom:12 }}>{T.summary_items}</p>
                  {booking.cart.map((item,i) => (
                    <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:14, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#f8fafc'}`, paddingBottom:10, marginBottom:10 }}>
                      <span style={{ fontWeight:500, color: isDark ? '#edeae4' : '#1e293b' }}>{item.title}</span>
                      <span style={{ color: isDark ? '#7c7770' : '#64748b' }}>{formatMoney(item.price,lang)}</span>
                    </div>
                  ))}
                </div>

                {/* Extras in summary */}
                {Object.keys(booking.extras||{}).filter(k=>booking.extras[k]).length > 0 && (
                  <div style={{ marginBottom:20, paddingBottom:20, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#f8fafc'}` }}>
                    <p className="label-micro" style={{ color: isDark ? '#4a4640' : '#94a3b8', marginBottom:12 }}>{T.summary_extras}</p>
                    {Object.keys(booking.extras||{}).filter(k=>booking.extras[k]).map(k => {
                      const ex=DATA.extras.find(e=>e.id===k);
                      if(!ex) return null;
                      const price=booking.cart.some(i=>i.type==='pack')?Math.floor(ex.price*0.8):ex.price;
                      return <div key={k} style={{ display:'flex', justifyContent:'space-between', fontSize:14, marginBottom:6, color: isDark ? '#c8c4be' : '#475569' }}><span>{ex.label}</span><span>+{formatMoney(price,lang)}</span></div>;
                    })}
                  </div>
                )}

                {/* Session info */}
                <div style={{ marginBottom:20, paddingBottom:20, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#f8fafc'}` }}>
                  <p className="label-micro" style={{ color: isDark ? '#4a4640' : '#94a3b8', marginBottom:12 }}>{T.summary_info}</p>
                  {[
                    { icon:'calendar', text:`${booking.date?new Date(booking.date).toLocaleDateString(lang==='en'?CONFIG.LOCALE_EN:CONFIG.LOCALE_PT):''} ${lang==='en'?'at':'às'} ${booking.time}` },
                    { icon:'map-pin', text: booking.locationType==='home'?T.summary_loc_home:booking.locationType==='motel'?T.summary_loc_motel:T.summary_loc_hotel },
                    { icon:'clock', text:`${lang==='en'?'Estimated time':'Tempo estimado'}: ${financials.duration} min` },
                  ].map((row,i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:10, fontSize:14, marginBottom:8, color: isDark ? '#c8c4be' : '#475569' }}>
                      <Icon name={row.icon} size={15} style={{ color:'#3b82f6', flexShrink:0 }} />
                      {row.text}
                    </div>
                  ))}
                </div>

                {/* Price breakdown */}
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {[
                    { label:T.subtotal, value:formatMoney(financials.sub,lang), color: isDark ? '#7c7770' : '#64748b' },
                    booking.appliedCoupon && { label:`🎁 ${booking.appliedCoupon.code}`, value:`-${formatMoney(financials.disc,lang)}`, color: isDark ? '#34d399' : '#059669' },
                    financials.mediaDisc>0 && { label:T.media_discount, value:`-${formatMoney(financials.mediaDisc,lang)}`, color: isDark ? '#60a5fa' : '#3b82f6' },
                    financials.pixDisc>0 && { label:T.pix_discount, value:`-${formatMoney(financials.pixDisc,lang)}`, color: isDark ? '#c8c4be' : '#475569' },
                    financials.rushFee>0 && { label:`🚗 ${T.msg_rush_fee}`, value:`+${formatMoney(financials.rushFee,lang)}`, color: isDark ? '#fbbf24' : '#d97706' },
                  ].filter(Boolean).map((row,i) => (
                    <div key={i} style={{ display:'flex', justifyContent:'space-between', fontSize:14, color:row.color }}>
                      <span>{row.label}</span><span>{row.value}</span>
                    </div>
                  ))}
                  {/* Total */}
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', paddingTop:16, borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9'}` }}>
                    <span className="label-micro" style={{ color: isDark ? '#5c5850' : '#94a3b8' }}>{T.total_label}</span>
                    <div style={{ textAlign:'right' }}>
                      <p style={{ fontSize:32, fontWeight:800, lineHeight:1, margin:0, background:'linear-gradient(135deg,#60a5fa,#818cf8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>{formatMoney(financials.total,lang)}</p>
                      <p style={{ fontSize:11, margin:'4px 0 0', display:'flex', alignItems:'center', justifyContent:'flex-end', gap:4, color: isDark ? '#60a5fa' : '#3b82f6' }}>
                        <Icon name="sparkles" size={10} /> +{estimatedXP} {T.xp_guaranteed}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Uber notice */}
                {booking.locationType !== 'motel' && (
                  <div style={{ display:'flex', alignItems:'flex-start', gap:10, padding:14, borderRadius:14, fontSize:13, lineHeight:1.7, marginTop:16, background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : '#f1f5f9'}`, color: isDark ? '#5c5850' : '#94a3b8' }}>
                    <Icon name="car" size={14} style={{ flexShrink:0, marginTop:2 }} />
                    {T.uber_notice}
                  </div>
                )}
              </div>

              {/* ─ RIGHT COLUMN ─ */}
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                {/* Coupon */}
                <div style={{ ...surfacePad }}>
                  <h4 style={{ fontSize:15, fontWeight:700, margin:'0 0 16px', color: isDark ? '#edeae4' : '#1e293b', display:'flex', alignItems:'center', gap:8 }}>
                    <Icon name="ticket" size={16} style={{ color: isDark ? '#5c5850' : '#94a3b8' }} />{T.coupon_section}
                  </h4>
                  {user.coupons.length > 0 && (
                    <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:14 }}>
                      {user.coupons.map(c => (
                        <button key={c.id} onClick={() => { setBooking(b=>({...b,appliedCoupon:b.appliedCoupon?.id===c.id?null:c})); vibrate(30); }} style={{ padding:'6px 14px', borderRadius:12, fontSize:11, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', border: `1.5px solid ${booking.appliedCoupon?.id===c.id ? '#34d399' : isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`, background: booking.appliedCoupon?.id===c.id ? 'rgba(52,211,153,0.15)' : isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc', color: booking.appliedCoupon?.id===c.id ? '#34d399' : isDark ? '#7c7770' : '#94a3b8', display:'flex', alignItems:'center', gap:6, transition:'all 0.2s' }}>
                          {booking.appliedCoupon?.id===c.id && <Icon name="check" size={11} />}{c.code}
                        </button>
                      ))}
                    </div>
                  )}
                  <div style={{ display:'flex', gap:8 }}>
                    <input type="text" value={couponInput} onChange={e=>setCouponInput(e.target.value.toUpperCase())} onKeyDown={e=>e.key==='Enter'&&handleApplyCoupon()} placeholder={T.coupon_placeholder} style={{ flex:1, height:44, padding:'0 14px', borderRadius:14, fontSize:13, fontWeight:500, fontFamily:'Poppins,sans-serif', letterSpacing:'0.08em', textTransform:'uppercase', background: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc', border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`, color: isDark ? '#edeae4' : '#1a1714', outline:'none' }} />
                    <button onClick={handleApplyCoupon} style={{ height:44, padding:'0 18px', borderRadius:14, fontSize:12, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', background: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9', border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#e2e8f0'}`, color: isDark ? '#c8c4be' : '#64748b', transition:'all 0.2s' }}>{T.coupon_apply}</button>
                  </div>
                </div>

                {/* Portfolio */}
                <div style={{ ...surfacePad }}>
                  <div style={{ display:'flex', alignItems:'flex-start', gap:14, marginBottom:16 }}>
                    <div style={{ width:40, height:40, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, background: isDark ? 'rgba(255,255,255,0.07)' : '#f8fafc', color: isDark ? '#7c7770' : '#94a3b8' }}>
                      <Icon name="camera" size={18} />
                    </div>
                    <div>
                      <h4 style={{ fontSize:14, fontWeight:700, margin:'0 0 4px', color: isDark ? '#edeae4' : '#1e293b' }}>{T.media_title}</h4>
                      <p style={{ fontSize:12, margin:0, lineHeight:1.7, color: isDark ? '#5c5850' : '#94a3b8' }}>{T.media_desc}</p>
                    </div>
                  </div>
                  <button onClick={() => { setBooking(b=>({...b,mediaAllowed:!b.mediaAllowed})); vibrate(30); }} style={{
                    width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', borderRadius:14, border: `1.5px solid ${booking.mediaAllowed ? (isDark ? 'rgba(59,130,246,0.4)' : '#bfdbfe') : isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`, background: booking.mediaAllowed ? (isDark ? 'rgba(59,130,246,0.1)' : '#eff6ff') : 'transparent', transition:'all 0.2s',
                  }}>
                    <span style={{ fontSize:12, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color: booking.mediaAllowed ? (isDark ? '#60a5fa' : '#3b82f6') : isDark ? '#5c5850' : '#94a3b8' }}>{booking.mediaAllowed ? T.media_granted : T.media_support}</span>
                    <span style={{ fontSize:11, fontWeight:600, padding:'4px 10px', borderRadius:10, background: booking.mediaAllowed ? '#3b82f6' : isDark ? 'rgba(255,255,255,0.07)' : '#f1f5f9', color: booking.mediaAllowed ? '#fff' : isDark ? '#5c5850' : '#94a3b8' }}>{T.media_bonus}</span>
                  </button>
                </div>

                {/* Payment */}
                <div style={{ ...surfacePad }} className={hasErrorGlobal&&!booking.payment?'animate-shake':''}>
                  <h4 style={{ fontSize:15, fontWeight:700, margin:'0 0 16px', color: isDark ? '#edeae4' : '#1e293b' }}>{T.payment_title}</h4>
                  <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                    {[
                      {id:'pix',label:T.pay_pix,icon:'smartphone'},
                      {id:'card',label:T.pay_card,icon:'credit-card'},
                      {id:'money',label:T.pay_cash,icon:'banknote'},
                    ].map(p => (
                      <button key={p.id} onClick={() => { setBooking(b=>({...b,payment:p.id})); vibrate(30); if(p.id==='pix'){navigator.clipboard.writeText(CONFIG.PIX_KEY);addToast(T.toast_pix_copied);} }} style={{
                        display:'flex', alignItems:'center', gap:14, padding:'14px 18px', height:56, borderRadius:18, border: `1.5px solid ${booking.payment===p.id ? '#60a5fa' : isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`, background: booking.payment===p.id ? '#3b82f6' : isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', color: booking.payment===p.id ? '#fff' : isDark ? '#c8c4be' : '#475569', transition:'all 0.2s', boxShadow: booking.payment===p.id ? '0 6px 20px rgba(59,130,246,0.28)' : 'none',
                      }}>
                        <Icon name={p.icon} size={20} style={{ flexShrink:0 }} />
                        <span style={{ flex:1, textAlign:'left', fontSize:14, fontWeight:500 }}>{p.label}</span>
                        <div style={{ width:20, height:20, borderRadius:'50%', border: `2px solid ${booking.payment===p.id ? '#fff' : isDark ? 'rgba(255,255,255,0.2)' : '#cbd5e1'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.2s' }}>
                          {booking.payment===p.id && <div style={{ width:8, height:8, borderRadius:'50%', background:'#fff' }} />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Terms */}
                <div className={hasErrorGlobal&&!booking.termsAccepted?'animate-shake':''}>
                  <button onClick={() => setTermsOpen(true)} style={{
                    width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:20, borderRadius:20, cursor:'pointer', transition:'all 0.3s',
                    background: booking.termsAccepted ? (isDark ? 'rgba(52,211,153,0.08)' : '#f0fdf4') : isDark ? 'rgba(255,255,255,0.03)' : '#fff',
                    border: `1.5px solid ${booking.termsAccepted ? (isDark ? 'rgba(52,211,153,0.35)' : '#86efac') : isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
                    boxShadow: isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.05)',
                  }}>
                    <div style={{ display:'flex', alignItems:'center', gap:14, minWidth:0 }}>
                      <div style={{ flexShrink:0, width:42, height:42, borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', background: booking.termsAccepted ? (isDark ? 'rgba(52,211,153,0.12)' : '#dcfce7') : isDark ? 'rgba(255,255,255,0.07)' : '#f1f5f9', color: booking.termsAccepted ? '#34d399' : isDark ? '#5c5850' : '#94a3b8' }}>
                        <Icon name="heart" size={20} />
                      </div>
                      <div style={{ textAlign:'left' }}>
                        <p style={{ fontSize:14, fontWeight:600, margin:'0 0 3px', color: isDark ? '#edeae4' : '#1e293b' }}>{T.terms_title}</p>
                        <p style={{ fontSize:12, margin:0, color: isDark ? '#5c5850' : '#94a3b8' }}>{T.terms_read}</p>
                      </div>
                    </div>
                    <div onClick={e => { e.stopPropagation(); vibrate(30); setBooking(b=>({...b,termsAccepted:!b.termsAccepted})); }} style={{ width:32, height:32, borderRadius:'50%', border: `2px solid ${booking.termsAccepted ? '#34d399' : isDark ? 'rgba(255,255,255,0.2)' : '#cbd5e1'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, background: booking.termsAccepted ? '#34d399' : 'transparent', color:'#fff', transition:'all 0.2s', boxShadow: booking.termsAccepted ? '0 4px 12px rgba(52,211,153,0.3)' : 'none' }}>
                      {booking.termsAccepted && <Icon name="check" size={15} />}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════
            STEP 4 — SUCCESS
        ═══════════════════════════════ */}
        {step === 4 && (
          <section className="animate-scale-in" style={{ minHeight:'80vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', maxWidth:400, margin:'0 auto', padding:'40px 16px' }}>
            {/* Success ring */}
            <div style={{ position:'relative', marginBottom:40 }}>
              <div className="animate-ping" style={{ position:'absolute', inset:0, borderRadius:'50%', background:'rgba(52,211,153,0.2)' }} />
              <div style={{ position:'absolute', inset:0, borderRadius:'50%', boxShadow:'0 0 60px 20px rgba(52,211,153,0.15)' }} />
              <div style={{ position:'relative', width:96, height:96, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background: isDark ? 'rgba(52,211,153,0.08)' : '#f0fdf4', border:'2px solid rgba(52,211,153,0.45)' }}>
                <Icon name="check" size={42} style={{ color:'#34d399' }} />
              </div>
            </div>

            <h2 style={{ fontSize:36, fontWeight:800, margin:'0 0 12px', color: isDark ? '#edeae4' : '#1e293b' }}>{T.success_title}</h2>
            <p style={{ fontSize:15, lineHeight:1.8, margin:'0 0 32px', color: isDark ? '#7c7770' : '#64748b', maxWidth:320 }}>{T.success_sub}</p>

            {/* Booking details */}
            <div style={{ width:'100%', ...surfacePad, marginBottom:28, textAlign:'left', display:'flex', flexDirection:'column', gap:10 }}>
              {[
                { icon:'user', text:user.name },
                { icon:'calendar', text:`${booking.date?new Date(booking.date).toLocaleDateString(lang==='en'?CONFIG.LOCALE_EN:CONFIG.LOCALE_PT):''} ${lang==='en'?'at':'às'} ${booking.time}` },
              ].map((row,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:10, fontSize:14, color: isDark ? '#c8c4be' : '#475569' }}>
                  <Icon name={row.icon} size={15} style={{ color:'#3b82f6', flexShrink:0 }} />
                  {row.text}
                </div>
              ))}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', paddingTop:12, borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'}` }}>
                <span style={{ fontSize:13, fontWeight:600, color: isDark ? '#7c7770' : '#64748b' }}>{T.total_label}</span>
                <span style={{ fontSize:28, fontWeight:800, background:'linear-gradient(135deg,#60a5fa,#818cf8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>{formatMoney(financials.total,lang)}</span>
              </div>
            </div>

            <div style={{ width:'100%', display:'flex', flexDirection:'column', gap:12 }}>
              <Button variant="whatsapp" size="lg" full icon="message" onClick={() => openExternal('whatsapp',generateWhatsAppMsg())}>{T.whatsapp_btn}</Button>
              <button onClick={() => { setStep(0); setBooking({...booking,cart:[],termsAccepted:false,appliedCoupon:null,bookingId:`BOOK_${Date.now()}`,mediaAllowed:false}); }} style={{ fontSize:13, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', padding:12, background:'none', border:'none', cursor:'pointer', transition:'color 0.2s', color: isDark ? '#4a4640' : '#94a3b8' }}>
                {T.back_home}
              </button>
            </div>
          </section>
        )}
      </main>

      {/* ── STICKY BOTTOM NAV ── */}
      {step >= 0 && step < 4 && booking.cart.length > 0 && (
        <nav className="animate-slide-up" style={{ position:'fixed', bottom:0, left:0, right:0, padding:'8px 16px 20px', zIndex:40, pointerEvents:'none' }}>
          <div className="glass-strong" style={{ maxWidth:900, margin:'0 auto', pointerEvents:'auto', borderRadius:28, overflow:'hidden', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, boxShadow: isDark ? '0 -8px 48px rgba(0,0,0,0.6)' : '0 -8px 32px rgba(0,0,0,0.12)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px' }}>
              {/* Back btn */}
              {step > 0 && (
                <button onClick={() => { setStep(s=>s-1); vibrate(30); }} style={{ width:50, height:50, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:16, border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', color: isDark ? '#7c7770' : '#94a3b8', flexShrink:0, transition:'all 0.2s' }}>
                  <Icon name="chevron-left" size={21} />
                </button>
              )}

              {/* Price */}
              <div style={{ flex:1, minWidth:0, paddingLeft: step===0 ? 8 : 0 }}>
                <p className="label-micro" style={{ color: isDark ? '#4a4640' : '#94a3b8', marginBottom:2, fontSize:10 }}>
                  {step===0 ? `${booking.cart.length} ${T.items_selected}` : step===3 ? T.total_label : T.subtotal}
                </p>
                <p style={{ fontSize:24, fontWeight:800, lineHeight:1, margin:0, color: isDark ? '#edeae4' : '#1a1714' }}>
                  {step===3 ? formatMoney(financials.total,lang) : formatMoney(financials.sub,lang)}
                </p>
              </div>

              {/* CTA */}
              <button onClick={handleNextStep} style={{
                position:'relative', display:'flex', alignItems:'center', gap:8, height:50, padding:'0 28px', borderRadius:18, fontFamily:'Poppins,sans-serif', fontSize:13, fontWeight:600, letterSpacing:'0.04em', flexShrink:0, transition:'all 0.2s', overflow:'hidden',
                background: isStepValid() ? (step===3 ? '#25D366' : '#3b82f6') : isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
                color: isStepValid() ? '#fff' : isDark ? '#3a3630' : '#cbd5e1',
                boxShadow: isStepValid() ? (step===3 ? '0 6px 20px rgba(37,211,102,0.32)' : '0 6px 20px rgba(59,130,246,0.32)') : 'none',
                border: `1px solid ${isStepValid() ? 'transparent' : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
              }}>
                {step===3 ? <><Icon name="message" size={17} /><span>{T.finish_btn}</span></> : <><span>{T.next_btn}</span><Icon name="chevron-right" size={17} /></>}
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* ══════════════════════════════════════════
          MODAL: TERMS — CENTRALIZADO COM X
      ══════════════════════════════════════════ */}
      {termsOpen && (
        <div className="modal-overlay" onClick={() => setTermsOpen(false)}>
          <div className="modal-box" style={{ background: isDark ? '#0c0d14' : '#fff' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9' }}>
              <h3 style={{ fontSize:19, fontWeight:700, margin:0, color: isDark ? '#edeae4' : '#1e293b' }}>{T.rules_complete}</h3>
              <button className="modal-close" onClick={() => setTermsOpen(false)} aria-label="Fechar">
                <Icon name="x" size={18} />
              </button>
            </div>
            <div className="modal-body" style={{ padding:'20px 24px' }}>
              <div style={{ display:'flex', flexDirection:'column' }}>
                {DATA.rules.map((rule,i) => <RuleItem key={i} rule={rule} isDark={isDark} />)}
              </div>
            </div>
            <div className="modal-footer" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9' }}>
              <Button full size="lg" onClick={() => { setBooking(b=>({...b,termsAccepted:true})); vibrate(30); setTermsOpen(false); }}>{T.agree_terms}</Button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          MODAL: WELCOME — CENTRALIZADO COM X
      ══════════════════════════════════════════ */}
      {welcomePopup && (
        <div className="modal-overlay" onClick={() => setWelcomePopup(false)}>
          <div className="modal-box" style={{ background: isDark ? '#0c0d14' : '#fff' }} onClick={e => e.stopPropagation()}>
            {/* Close X */}
            <button className="modal-close" onClick={() => { setWelcomePopup(false); setUser(u=>({...u,hasSeenWelcome:true})); }} aria-label="Fechar" style={{ position:'absolute', top:16, right:16, zIndex:10 }}>
              <Icon name="x" size={18} />
            </button>

            <div style={{ padding:'32px 28px 28px', display:'flex', flexDirection:'column', gap:0, position:'relative', overflow:'hidden' }}>
              {/* Ambient */}
              <div style={{ position:'absolute', top:'-20%', right:'-10%', width:200, height:200, background:'rgba(59,130,246,0.06)', borderRadius:'50%', filter:'blur(24px)', pointerEvents:'none' }} />

              <div style={{ width:60, height:60, borderRadius:20, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20, background: isDark ? 'rgba(59,130,246,0.1)' : '#eff6ff', border: `1px solid ${isDark ? 'rgba(59,130,246,0.2)' : '#bfdbfe'}`, color:'#3b82f6', position:'relative', zIndex:1 }}>
                <Icon name="gift" size:={28} size={28} />
              </div>
              <h3 style={{ fontSize:24, fontWeight:800, margin:'0 0 12px', color: isDark ? '#edeae4' : '#1e293b', position:'relative', zIndex:1 }}>{T.welcome_popup_title}</h3>
              <p style={{ fontSize:14, lineHeight:1.8, margin:'0 0 16px', color: isDark ? '#7c7770' : '#64748b', position:'relative', zIndex:1 }}>{T.welcome_popup_msg}</p>

              <div style={{ padding:12, borderRadius:14, marginBottom:20, fontSize:12, lineHeight:1.7, background: isDark ? 'rgba(245,158,11,0.07)' : '#fffbeb', border: `1px solid ${isDark ? 'rgba(245,158,11,0.18)' : '#fde68a'}`, color: isDark ? '#fbbf24' : '#92400e', position:'relative', zIndex:1 }}>
                {T.welcome_popup_warning}
              </div>

              {/* Coupon display */}
              <div style={{ padding:20, borderRadius:18, border: `2px dashed ${isDark ? 'rgba(59,130,246,0.3)' : '#bfdbfe'}`, background: isDark ? 'rgba(59,130,246,0.05)' : '#eff6ff', textAlign:'center', marginBottom:24, position:'relative', zIndex:1 }}>
                <p className="label-micro" style={{ color: isDark ? '#4a4640' : '#94a3b8', marginBottom:8 }}>{lang==='en'?'Your first gift':'Seu presente inaugural'}</p>
                <p style={{ fontSize:28, fontWeight:800, margin:0, letterSpacing:'0.15em', color: isDark ? '#edeae4' : '#1e293b' }}>BEMVINDO10</p>
              </div>

              <Button full size="lg" onClick={() => {
                setWelcomePopup(false); vibrate([50,100]);
                const c = { id:'welcome', val:10, title:'🎁 BEMVINDO10', code:'BEMVINDO10' };
                setUser(u=>({...u,hasSeenWelcome:true,coupons:[...u.coupons,c]}));
                setBooking(b=>({...b,appliedCoupon:c}));
                addToast(T.toast_coupon_success);
              }} style={{ position:'relative', zIndex:1 }}>{T.get_coupon}</Button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          MODAL: LEVEL UP — CENTRALIZADO COM X
      ══════════════════════════════════════════ */}
      {levelUpPopup && (
        <div className="modal-overlay" onClick={() => setLevelUpPopup(false)}>
          <div className="modal-box" style={{ background: isDark ? '#0c0d14' : '#fff', borderColor: isDark ? 'rgba(245,158,11,0.3)' : '#fde68a', overflow:'hidden' }} onClick={e => e.stopPropagation()}>
            {/* Close X */}
            <button className="modal-close" onClick={() => { setLevelUpPopup(false); vibrate(50); }} aria-label="Fechar" style={{ position:'absolute', top:16, right:16, zIndex:10 }}>
              <Icon name="x" size={18} />
            </button>

            {/* Ambient glow */}
            <div style={{ position:'absolute', top:'-30%', left:'50%', transform:'translateX(-50%)', width:280, height:280, background:'rgba(245,158,11,0.12)', borderRadius:'50%', filter:'blur(32px)', pointerEvents:'none' }} />

            <div style={{ padding:'48px 28px 32px', display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', gap:0, position:'relative' }}>
              <div className="animate-bounce-slow" style={{ width:72, height:72, borderRadius:24, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:24, background:'linear-gradient(135deg,#f59e0b,#d97706)', color:'#1a1714', boxShadow:'0 12px 32px rgba(245,158,11,0.4)', position:'relative', zIndex:1 }}>
                <Icon name="trophy" size={34} />
              </div>

              <h3 style={{ fontSize:30, fontWeight:800, margin:'0 0 12px', color: isDark ? '#edeae4' : '#1e293b', position:'relative', zIndex:1 }}>{T.levelup_popup_title}</h3>
              <p style={{ fontSize:14, lineHeight:1.8, margin:'0 0 32px', color: isDark ? '#7c7770' : '#64748b', maxWidth:320, position:'relative', zIndex:1 }}>{T.levelup_popup_msg}</p>

              <div style={{ width:'100%', position:'relative', zIndex:1 }}>
                <Button full size="lg" variant="amber" onClick={() => { setLevelUpPopup(false); vibrate(50); }}>{T.level_redeem}</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
