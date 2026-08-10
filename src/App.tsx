import React, { useState, useEffect, useMemo, useRef, useCallback, memo } from 'react';

// ==================================================================================
// DESIGN TOKENS & CONFIG (LUXURY / EXECUTIVE VIP THEME)
// ==================================================================================
const CONFIG = {
  PHONE: "5517991360413",
  INSTAGRAM_URL: "https://instagram.com/relaxarhojesp",
  STORAGE_KEY: '@thaly_app_v28_vip_men',
  PIX_KEY: "62.922.530/0001-14",
  LOCALE_PT: 'pt-BR',
  LOCALE_EN: 'en-US',
  EXCHANGE_RATE: 5.0,
  SECRET_TOKEN: 'THALY_SECURE_V12',
  START_HOUR: 9,
  END_HOUR: 22,
  MAX_STORAGE_SIZE: 5000
} as const;

const RUSH_HOURS = ['12:00', '13:00', '17:00', '18:00', '19:00', '20:00'];
const RUSH_FEE = 20;

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
  'smartphone': 'M5 2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z M12 18h.01',
  'message': 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8.9h.5a8.48 8.48 0 0 1 8 8v.5z',
  'clock': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2',
  'award': 'M12 15l-2 5-9-9 9-9 9 9-9 9-2-5',
  'shield': 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  'gift': 'M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7 M16 8h-4 M4 8h16a2 2 0 0 1 2 2v2H2v-2a2 2 0 0 1 2-2z M12 8V4 M12 8V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4 M12 8V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4',
  'lock': 'M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zm-7 6v-2m4-4V7a4 4 0 0 0-8 0v4',
  'fire': 'M12 2c0 0-5 3.5-5 9 0 4.5 3 6.5 5 11 2-4.5 5-6.5 5-11 0-5.5-5-9-5-9z',
  'power': 'M18.36 6.64a9 9 0 1 1-12.73 0M12 2v10',
  'eye-off': 'M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22'
};

// ==================================================================================
// GLOBAL STYLES (EXECUTIVE DARK THEME ENFORCED)
// ==================================================================================
const GlobalStyles = memo(() => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');

    *, *::before, *::after { 
      box-sizing: border-box; 
      -webkit-font-smoothing: antialiased; 
      -moz-osx-font-smoothing: grayscale; 
    }

    :root {
      --font-sans: 'Inter', sans-serif;
      --font-display: 'Inter', sans-serif;
      /* Executive Dark Theme */
      --c-bg: #09090b; /* Zinc 950 */
      --c-surface: #18181b; /* Zinc 900 */
      --c-border: rgba(255,255,255,0.08);
      --c-text: #f4f4f5;
      --c-text-muted: #a1a1aa; 
      --c-primary: #d97706; /* Amber 600 - Luxury Gold */
      --c-primary-glow: rgba(217,119,6,0.2);
    }

    html, body {
      background-color: var(--c-bg);
      color: var(--c-text);
      font-family: var(--font-sans);
      overscroll-behavior-y: none;
      -webkit-tap-highlight-color: transparent;
      letter-spacing: -0.01em;
      line-height: 1.5;
      font-size: 15px; 
    }

    h1, h2, h3, h4, h5, h6 { font-weight: 700; letter-spacing: -0.02em; }
    .font-display { font-family: var(--font-display); font-weight: 800; }
    .font-serif { font-family: 'Playfair Display', serif; }

    *:focus-visible { outline: 2px solid var(--c-primary); outline-offset: 4px; }

    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

    @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes scaleIn { from { transform: scale(0.97); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    @keyframes toast-in { from { transform: translateY(-20px) scale(0.95); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
    
    .animate-fade-up { animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-scale-in { animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-toast-in { animation: toast-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

    /* Premium Card Hover */
    .card-hover { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
    @media (hover: hover) { .card-hover:hover { transform: translateY(-3px); border-color: rgba(255,255,255,0.2); } }
    
    /* Selection Glow */
    .service-card-selected { 
      border-color: var(--c-primary); 
      background: linear-gradient(145deg, rgba(217,119,6,0.1) 0%, rgba(24,24,27,1) 100%);
      box-shadow: 0 0 0 1px var(--c-primary), 0 10px 30px var(--c-primary-glow); 
    }

    input, button { font-family: inherit; }
    button { cursor: pointer; border: none; }
    
    /* Elegant Inputs */
    .input-field {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.1);
      color: #fff;
      transition: all 0.2s ease;
    }
    .input-field:focus { 
      outline: none; 
      border-color: var(--c-primary); 
      background: rgba(217,119,6,0.05);
      box-shadow: 0 0 0 3px var(--c-primary-glow); 
    }

    .text-gradient-gold { 
      background: linear-gradient(135deg, #fbbf24, #d97706); 
      -webkit-background-clip: text; 
      -webkit-text-fill-color: transparent; 
      background-clip: text; 
    }
  `}} />
));

// ==================================================================================
// UTILITIES
// ==================================================================================
const sanitizeInput = (v: string): string => String(v || '').replace(/[<>&"']/g, '');
const validateAddress = (a: any): boolean => !!(a.street && a.number && a.district && a.city);

const vibrate = (pattern: number | number[] = 50) => {
  try { if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(pattern); } catch (e) {}
};

const maskCEP = (v: string) => v.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);

const formatMoney = (val: number | undefined) => {
  if (val === undefined || isNaN(val)) return 'R$ 0,00';
  return `R$ ${val.toFixed(2).replace('.', ',')}`;
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
interface ServiceItem { 
  id: string; min: number; price: number; icon: string; tag: string; title: string; 
  desc: string; details: string; fullPrice?: number; type?: string; popular?: boolean; 
  category?: 'essential' | 'premium' | 'immersion'; 
  // UX Markers for 35-55 Men
  intensity: number; // 1 to 3 (Pressure/Force)
  contactLevel: number; // 1 to 3 (Skin contact / Sensuality)
  durationText: string;
  result: string; // The ultimate benefit
}
interface Coupon { id: string; val: number; title: string; code: string; }
interface Review { n: string; age: string; t: string; s: number; serv: string; }
interface UserData { name: string; xp: number; coupons: Coupon[]; usedCoupons: string[]; ordersCount: number; }
interface Address { cep: string; street: string; number: string; district: string; city: string; comp: string; placeName: string; }
interface BookingData { type: 'single' | 'pack'; cart: ServiceItem[]; extras: Record<string, boolean>; date: string | null; time: string | null; locationType: 'home' | 'motel' | 'hotel'; address: Address; payment: string; appliedCoupon: Coupon | null; termsAccepted: boolean; customExtraText: string; }

// ==================================================================================
// DATA & COPY (TAILORED FOR 35-55 HETERO MEN)
// ==================================================================================
const getData = () => {
  const p = { relax: 180, crossfit: 200, sens: 200, titan: 250, reversa: 300, nuru: 350, pack_vip: { v: 877, full: 1097 } };

  return {
    levels: [
      { level: 1, xpNeeded: 0, reward: 0, title: "Membro Incial" },
      { level: 2, xpNeeded: 200, reward: 20, title: "Membro Executivo" },
      { level: 3, xpNeeded: 600, reward: 40, title: "Membro VIP" },
      { level: 4, xpNeeded: 1200, reward: 80, title: "Black Card" }
    ],
    services: [
      // ESSENTIALS (Focus on pain relief)
      { 
        id: 'relaxante', category: 'essential', min: 60, price: p.relax, icon: "power", 
        tag: "DESCOMPRESSÃO", title: "Massagem Clássica", 
        desc: "Derrete a tensão acumulada nos ombros, lombar e pescoço. Foco total em tirar o peso do estresse.", 
        details: "Mapeamento dos seus pontos de dor severa.\nUso de óleos aquecidos para soltar a musculatura.\nPressão firme para desfazer nós (trigger points).\nDesconexão mental imediata.",
        intensity: 3, contactLevel: 1, durationText: "60 min", result: "Corpo leve, zero dores e mente silenciosa."
      },
      { 
        id: 'crossfit', category: 'essential', min: 60, price: p.crossfit, icon: "zap", 
        tag: "RECUPERAÇÃO FÍSICA", title: "Massagem Desportiva", 
        desc: "Para quem treina pesado ou tem dores crônicas. Pressão forte e alongamentos para destravar o corpo.", 
        details: "Massagem com pressão de nível alto.\nAplicação de força precisa nas áreas inflamadas.\nUso de pomadas térmicas para alívio rápido.\nAlongamentos para devolver a sua mobilidade.",
        intensity: 3, contactLevel: 1, durationText: "60 min", result: "Músculos recuperados, destravados e prontos para o combate."
      },
      
      // PREMIUM (Focus on Sensuality/Touch)
      { 
        id: 'sensitiva', category: 'premium', min: 60, price: p.sens, icon: "fire", 
        tag: "DESPERTAR SENSORIAL", title: "Massagem Sensorial", 
        desc: "Começamos tirando suas dores. Depois, o ritmo desacelera para toques sutis que despertam sensações esquecidas.", 
        details: "Alívio muscular intenso inicial nas costas.\nTransição para toques sutis e prolongados.\nConstrução lenta de novas sensações físicas.\nFinalização manual profunda para liberação do estresse.",
        intensity: 1, contactLevel: 2, durationText: "60 min", result: "Ansiedade zerada e sentidos aguçados."
      },
      { 
        id: 'mista', category: 'premium', min: 60, price: p.titan, icon: "sparkles", 
        tag: "O MELHOR DOS DOIS MUNDOS", title: "Experiência Fusion", 
        desc: "A união perfeita: força para curar suas dores e contato próximo (pele a pele) para elevar sua energia.", 
        details: "Trabalho profundo nas costas para aliviar dores.\nMudança para contato físico muito próximo (atendo de lingerie).\nEstímulo visual e tátil avançado.\nFinalização intensa para recarregar sua energia vital.",
        intensity: 2, contactLevel: 3, durationText: "60 min", result: "Corpo sem tensão e libido renovada."
      },

      // IMMERSION (Focus on Complete Surrender)
      { 
        id: 'reversa', category: 'immersion', min: 60, price: p.reversa, icon: "refresh-cw", 
        tag: "DOMÍNIO E LIBERDADE", title: "Massagem Reversa", 
        desc: "Eu cuido do seu corpo primeiro. Depois, o controle passa para você. Total liberdade para tocar e explorar.", 
        details: "Massagem relaxante inicial para você se soltar (~30 min).\nA inversão: O controle da sessão passa a ser seu.\nLiberdade absoluta para ditar o ritmo e explorar o toque.\nTroca real de intimidade e finalização mútua.",
        intensity: 2, contactLevel: 3, durationText: "60 min", result: "Conexão profunda e controle total do momento."
      },
      { 
        id: 'nuru', category: 'immersion', min: 60, price: p.nuru, icon: "star", popular: true,
        tag: "ENTREGA ABSOLUTA", title: "Experiência Nuru", 
        desc: "A vivência máxima. Deslizamento fluido corpo a corpo com gel aquecido. Para quem quer esquecer do mundo.", 
        details: "Início focado em soltar a sua lombar e cervical.\nAplicação de gel especial japonês (aquecido) em ambos.\nDeslizamento total de corpo inteiro (frente e costas).\nToques sutis no lingam e finalização interativa profunda.",
        intensity: 2, contactLevel: 3, durationText: "60 min", result: "Êxtase corporal e descarga explosiva de estresse."
      }
    ] as ServiceItem[],
    
    plans: [
      { 
        id: 'pack_vip', type: 'pack', title: "Pacote Executive VIP (4 Sessões)", price: p.pack_vip.v, fullPrice: p.pack_vip.full, 
        desc: "Você não tem tempo a perder. Garanta 4 semanas de experiências exclusivas com sigilo absoluto.", 
        details: "1x Relaxante\n1x Fusion\n1x Reversa\n1x Nuru\n\nAtendimento prioritário na agenda.", 
        tag: "ACESSO VIP", icon: "award", intensity: 2, contactLevel: 3, durationText: "4 Semanas", result: "Um mês inteiro de alto rendimento e zero estresse."
      }
    ] as ServiceItem[],

    extras: [
      { id: 'more_time', price: 77, icon: "clock", label: "Tempo Estendido (+30 min)", desc: "Não tenha pressa. Aproveite o momento até o fim." },
      { id: 'aroma', price: 17, icon: "zap", label: "Óleos Essenciais Importados", desc: "Aromaterapia focada em baixar a frequência cerebral." }
    ],
    
    reviews: [
      { n: "Ricardo M.", age: "42 anos", t: "O nível de profissionalismo e sigilo é impecável. Sou empresário, vivo sob pressão, e a Experiência Nuru foi a única coisa que conseguiu desligar minha mente. Fantástico.", serv: "Experiência Nuru", s: 5 },
      { n: "Carlos E.", age: "48 anos", t: "Sofria com dores crônicas na lombar. A massagem desportiva resolveu na primeira sessão. Recomendo para quem precisa de resultado de verdade.", serv: "Massagem Desportiva", s: 5 },
      { n: "Anônimo", age: "39 anos", t: "Fiquei com receio da discrição no hotel, mas foi tudo perfeito. A massagem Fusion é inexplicável. Recarregou minhas baterias.", serv: "Experiência Fusion", s: 5 }
    ]
  };
};

// ==================================================================================
// UI COMPONENTS (EXECUTIVE LUXURY)
// ==================================================================================

const ToastContainer = memo(({ toasts }: { toasts: any[] }) => (
  <div aria-live="polite" className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-3 pointer-events-none w-[90vw] max-w-sm">
    {toasts.map(t => (
      <div key={t.id} role="alert" className={`animate-toast-in pointer-events-auto flex items-center gap-3 px-4 py-3.5 rounded-2xl border shadow-2xl ${t.type === 'error' ? 'bg-red-950 border-red-500/30 text-red-100' : 'bg-zinc-900 border-zinc-700 text-white'} backdrop-blur-xl`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${t.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-500'}`}>
          <Icon name={t.type === 'error' ? 'alert-circle' : 'check'} size={16} />
        </div>
        <span className="text-sm font-semibold leading-snug flex-1">{t.msg}</span>
      </div>
    ))}
  </div>
));

const Button = memo(({ children, onClick, variant = 'primary', size = 'md', disabled = false, full = false, icon, className = '' }: any) => {
  const base = "relative inline-flex items-center justify-center font-bold tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] gap-2 overflow-hidden";
  const variants: Record<string, string> = {
    primary: "bg-amber-600 text-black hover:bg-amber-500 shadow-[0_0_20px_rgba(217,119,6,0.2)]", // Gold/Amber focus
    whatsapp: "bg-[#25D366] text-black hover:bg-[#22c55e] shadow-[0_0_20px_rgba(37,211,102,0.2)]",
    outline: "border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white",
  };
  const sizes: Record<string, string> = {
    sm: "min-h-[40px] py-2 px-4 text-xs rounded-xl",
    md: "min-h-[50px] py-3 px-6 text-sm rounded-xl",
    lg: "min-h-[56px] py-3 px-8 text-base rounded-2xl",
  };
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${sizes[size]} ${full ? 'w-full' : ''} ${className}`}>
      {icon && <Icon name={icon} size={20} className="shrink-0" />}
      <span className="break-words text-center">{children}</span>
    </button>
  );
});

const InputField = memo(({ label, value, onChange, placeholder, icon, type = 'text', hasError = false, maxLength }: any) => (
  <div className={`space-y-2 w-full ${hasError ? 'animate-shake' : ''}`}>
    {label && <label className={`block text-[10px] font-bold uppercase tracking-widest pl-1 ${hasError ? 'text-red-400' : 'text-zinc-400'}`}>{label}</label>}
    <div className="relative group">
      {icon && (
        <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${hasError ? 'text-red-400' : 'text-zinc-500 group-focus-within:text-amber-500'}`}>
          <Icon name={icon} size={20} />
        </div>
      )}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} maxLength={maxLength}
        className={`input-field w-full min-h-[56px] rounded-xl text-sm font-medium ${icon ? 'pl-12 pr-4' : 'px-4'} ${hasError ? '!border-red-500/50 !bg-red-950/20 text-red-200' : ''}`}
      />
    </div>
  </div>
));

// --- THE NEW SENSORY SERVICE CARD ---
const ServiceCard = memo(({ service, isInCart, onToggle, isPack = false, onOpenModal }: any) => {
  const renderBars = (level: number) => (
    <div className="flex gap-1 mt-1">
      {[1, 2, 3].map(i => (
        <div key={i} className={`h-1.5 w-6 rounded-full transition-all ${i <= level ? (isPack ? 'bg-amber-500' : 'bg-amber-500') : 'bg-zinc-800'}`} />
      ))}
    </div>
  );

  return (
    <div className={`relative w-full text-left rounded-3xl border transition-all duration-300 card-hover flex flex-col h-auto overflow-hidden ${isInCart ? 'service-card-selected' : 'bg-[#121214] border-zinc-800 hover:border-zinc-700'}`}>
      
      {/* Privacy Badge overlay if selected */}
      {isInCart && (
        <div className="absolute top-4 right-4 z-10 bg-amber-500 text-black text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded flex items-center gap-1 animate-scale-in">
          <Icon name="check" size={12} /> Selecionado
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col cursor-pointer" onClick={() => onOpenModal(service)}>
        <div className="flex items-start gap-4 mb-3">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${isInCart ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}>
            <Icon name={service.icon} size={24} />
          </div>
          <div className="flex-1 min-w-0 pt-0.5 pr-8">
            <span className={`text-[9px] font-bold uppercase tracking-widest ${isPack ? 'text-amber-500' : 'text-zinc-500'}`}>{service.tag}</span>
            <h3 className="text-xl font-bold leading-tight truncate text-white mt-1">{service.title}</h3>
          </div>
        </div>
        
        <p className="text-sm mt-1 mb-4 leading-relaxed font-medium text-zinc-400 line-clamp-2">
          {service.desc}
        </p>

        {/* Sensory Gauges - Direct appeal to the male logic brain */}
        {!isPack && (
          <div className="grid grid-cols-2 gap-4 py-3 border-t border-zinc-800/50 mt-auto">
            <div>
              <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-500 flex items-center gap-1"><Icon name="zap" size={10} /> Força / Pressão</span>
              {renderBars(service.intensity)}
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-500 flex items-center gap-1"><Icon name="heart" size={10} /> Intimidade</span>
              {renderBars(service.contactLevel)}
            </div>
          </div>
        )}
      </div>

      <div className="px-5 py-4 flex items-center justify-between gap-3 bg-zinc-900/50 border-t border-zinc-800/50">
        <div>
          <span className="block text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-0.5">Investimento</span>
          <span className="font-display text-2xl leading-none text-white">{formatMoney(service.price)}</span>
        </div>
        <Button size="sm" variant={isInCart ? 'outline' : 'primary'} onClick={(e: any) => { e.stopPropagation(); onToggle(service); }} className={isInCart ? '!border-amber-500 !text-amber-500' : ''}>
          {isInCart ? 'Remover' : 'Agendar'}
        </Button>
      </div>
    </div>
  );
});

// --- THE NEW SESSION DOSSIER MODAL ---
const ServiceModal = memo(({ service, isOpen, onClose, onSelect, isInCart }: any) => {
  if (!isOpen || !service) return null;
  const steps = service.details.split('\n');

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
      <div role="dialog" className="relative w-full max-w-lg h-[90vh] sm:h-auto sm:max-h-[90vh] flex flex-col sm:rounded-3xl rounded-t-3xl border-t sm:border shadow-2xl animate-slide-up sm:animate-scale-in overflow-hidden bg-[#09090b] border-zinc-800">
        
        <div className="relative p-6 shrink-0 bg-zinc-900/50 border-b border-zinc-800">
          <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center transition-colors bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700">
            <Icon name="x" size={20} />
          </button>
          
          <div className="flex items-center gap-4 pr-12">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-gradient-to-br from-amber-600 to-amber-800 text-black shadow-lg">
              <Icon name={service.icon} size={28} />
            </div>
            <div>
               <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">{service.tag}</span>
               <h2 className="font-display text-2xl sm:text-3xl font-bold leading-none mt-1 text-white">{service.title}</h2>
               <span className="inline-flex items-center gap-1 text-xs text-zinc-400 mt-2 font-medium bg-zinc-800 px-2 py-1 rounded-md"><Icon name="clock" size={12} /> {service.durationText}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
          {/* Executive Summary */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest mb-3 text-zinc-500 border-b border-zinc-800 pb-2">O Objetivo</h4>
            <p className="text-base leading-relaxed font-medium text-zinc-300">{service.desc}</p>
          </div>

          {/* Timeline / Journey */}
          <div className="p-6 rounded-3xl border bg-zinc-900 border-zinc-800">
            <h4 className="text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2 text-white">
              <Icon name="map-pin" size={16} className="text-amber-500" /> A Jornada da Sessão
            </h4>
            <div className="space-y-6 relative before:absolute before:inset-y-2 before:left-[15px] before:w-px before:bg-gradient-to-b before:from-amber-600/50 before:to-transparent">
              {steps.map((stepStr: string, i: number) => (
                <div key={i} className="flex items-start gap-5 relative">
                  <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-[#09090b] border border-amber-600/50 text-amber-500 relative z-10 shadow-lg">
                    <span className="text-xs font-bold">{i + 1}</span>
                  </div>
                  <span className="text-sm sm:text-base leading-relaxed font-medium pt-1 text-zinc-300">{stepStr.replace(/^\d+\.\s*/, '')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ultimate Result Guarantee */}
          {service.result && (
            <div className="p-5 rounded-2xl flex gap-4 items-start bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-700">
              <div className="bg-emerald-500/20 text-emerald-500 p-2 rounded-xl shrink-0 mt-0.5">
                <Icon name="shield" size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-1">Garantia Final</p>
                <p className="text-sm font-bold text-white leading-relaxed">{service.result}</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 border-zinc-800 bg-zinc-900/80 backdrop-blur-md shrink-0">
          <div className="w-full sm:w-auto text-left">
            <span className="block text-[10px] uppercase font-bold tracking-widest text-zinc-500">Valor do Investimento</span>
            <span className="font-display text-3xl text-white">{formatMoney(service.price)}</span>
          </div>
          <Button size="lg" full={false} className="w-full sm:w-auto min-w-[200px]" variant={isInCart ? 'outline' : 'primary'} onClick={() => { onSelect(service); onClose(); }}>
            {isInCart ? 'Remover Seleção' : 'Agendar Experiência'}
          </Button>
        </div>
      </div>
    </div>
  );
});

// ==================================================================================
// MAIN APP ARCHITECTURE
// ==================================================================================
export default function App() {
  const [isClient, setIsClient] = useState(false);
  const [step, setStep] = useState(0);
  const [activeTab, setActiveTab] = useState('essential');
  const [toasts, setToasts] = useState<{ id: number; msg: string; type: 'success' | 'error' }[]>([]);
  const [isFetchingCep, setIsFetchingCep] = useState(false);
  const [hasErrorGlobal, setHasErrorGlobal] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const DATA = useMemo(() => getData(), []);

  const [user, setUser] = useState<UserData>({ name: '', xp: 0, coupons: [], usedCoupons: [], ordersCount: 147 });
  const [booking, setBooking] = useState<BookingData>({
    type: 'single', cart: [], extras: {}, date: null, time: null, locationType: 'hotel', // default to hotel for discretion
    address: { cep: '', street: '', number: '', district: '', city: '', comp: '', placeName: '' },
    payment: '', appliedCoupon: null, termsAccepted: false, customExtraText: ''
  });

  const dateScrollRef = useRef<HTMLDivElement>(null);

  const addToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts(p => [...p.slice(-2), { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);

  const openWhatsApp = () => {
    const f = financials;
    const dateStr = booking.date ? new Date(booking.date).toLocaleDateString(CONFIG.LOCALE_PT) : '';
    const hash = btoa(encodeURIComponent(`${f.total}-${dateStr}-${CONFIG.SECRET_TOKEN}`)).substring(0, 6).toUpperCase();

    const servicesText = booking.cart.map(i => `▪️ *${i.title}*`).join('\n');
    let locTxt = booking.locationType === 'home' ? `Residência: ${booking.address.street}, ${booking.address.number}` : 
                 booking.locationType === 'motel' ? `Local Discreto (A combinar)` : 
                 `Hotel: ${booking.address.placeName}`;

    const text = `*SOLICITAÇÃO DE ATENDIMENTO VIP* | #${hash}\n──────────────────\nOlá Thalyson. Preciso de uma pausa na rotina com total sigilo.\n\n👤 *Nome:* ${user.name}\n📅 *Data:* ${dateStr} às ${booking.time}\n\n*SELEÇÃO:*\n${servicesText}\n\n*LOCAL:* ${locTxt}\n\n*INVESTIMENTO TOTAL:* ${formatMoney(f.total)}\n*Pagamento:* ${booking.payment.toUpperCase()}\n──────────────────\n_Declaro estar ciente das normas de sigilo e respeito mutuo._`;
    
    window.open(`https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(text)}`, '_blank');
  };

  useEffect(() => { setIsClient(true); }, []);

  const handleToggleCartItem = useCallback((item: ServiceItem) => {
    vibrate(50);
    setBooking(prev => ({
      ...prev,
      cart: prev.cart.find(c => c.id === item.id) ? prev.cart.filter(c => c.id !== item.id) : [...prev.cart, item],
      payment: '', termsAccepted: false
    }));
    addToast('Seleção atualizada.');
  }, [addToast]);

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value; const masked = maskCEP(raw);
    setBooking(b => ({ ...b, address: { ...b.address, cep: masked } }));
    if (masked.length === 9) {
      setIsFetchingCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${masked.replace('-', '')}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setBooking(b => ({ ...b, address: { ...b.address, cep: masked, street: data.logradouro || b.address.street, district: data.bairro || b.address.district, city: data.localidade || b.address.city } }));
          addToast('Endereço localizado via CEP.', 'success'); vibrate(50);
        } else { addToast('CEP não encontrado.', 'error'); }
      } catch (err) {} finally { setIsFetchingCep(false); }
    }
  };

  const daysArray = useMemo(() => {
    const days = []; const today = new Date();
    for (let i = 0; i < 21; i++) { const d = new Date(today); d.setDate(today.getDate() + i); days.push(d); }
    return days;
  }, []);

  const generateTimeSlots = useMemo(() => {
    if (!booking.date) return [];
    const slots = [];
    for (let i = CONFIG.START_HOUR; i <= CONFIG.END_HOUR; i++) slots.push(`${i < 10 ? '0' : ''}${i}:00`);
    const now = new Date(); const sel = new Date(booking.date);
    if (sel.toDateString() === now.toDateString()) {
      const cur = now.getHours(); return slots.filter(t => parseInt(t) > cur);
    }
    return slots;
  }, [booking.date]);

  const financials = useMemo(() => {
    if (booking.cart.length === 0) return { total: 0, sub: 0 };
    let sub = 0;
    booking.cart.forEach(item => { sub += item.price; });
    Object.keys(booking.extras).forEach(k => { if (booking.extras[k]) { const ex = DATA.extras.find(e => e.id === k); if (ex) sub += ex.price; } });
    const isRush = RUSH_HOURS.includes(booking.time || '');
    const rushFee = (isRush && booking.locationType !== 'motel') ? RUSH_FEE : 0;
    return { sub, total: sub + rushFee, rushFee };
  }, [booking.cart, booking.extras, booking.time, booking.locationType, DATA.extras]);

  const isStepValid = useCallback(() => {
    if (step === 0) return booking.cart.length > 0;
    if (step === 1) {
      if (!user.name || user.name.trim().length < 3) return false;
      if (booking.locationType === 'home') return validateAddress(booking.address);
      if (booking.locationType === 'hotel') return !!(booking.address.placeName);
      return true;
    }
    if (step === 2) return !!(booking.date && booking.time);
    if (step === 3) return !!(booking.payment);
    return true;
  }, [step, booking, user.name]);

  const handleNextStep = useCallback(() => {
    if (!isStepValid()) {
      vibrate([50, 50]); setHasErrorGlobal(true); setTimeout(() => setHasErrorGlobal(false), 500);
      const msgs: Record<number, string> = { 0: "Selecione uma experiência.", 1: "Preencha os dados de sigilo obrigatórios.", 2: "Defina o horário do encontro.", 3: "Selecione a forma de pagamento." };
      addToast(msgs[step] || '', 'error'); return;
    }
    vibrate(30); window.scrollTo({ top: 0, behavior: 'smooth' });
    if (step === 3) { openWhatsApp(); setStep(4); } else setStep(s => s + 1);
  }, [step, booking, user.name, addToast, isStepValid]);

  if (!isClient) return <div className="min-h-screen bg-[#09090b]" />;

  return (
    <>
      <GlobalStyles />
      <ToastContainer toasts={toasts} />
      
      <ServiceModal service={selectedService} isOpen={!!selectedService} onClose={() => setSelectedService(null)} onSelect={handleToggleCartItem} isInCart={selectedService ? booking.cart.some(c => c.id === selectedService.id) : false} />

      {/* Floating Trust Badge */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 px-3 py-1.5 rounded-full shadow-xl pointer-events-none">
        <Icon name="lock" size={12} className="text-amber-500" />
        <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-300">Ambiente Seguro & Sigiloso</span>
      </div>

      <main className={`min-h-screen relative z-10 pb-40 px-4 sm:px-6 max-w-3xl mx-auto overflow-x-hidden`}>
        {step !== 4 && (
          <header className="pt-16 pb-8">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-2 leading-tight">
              Thalyson <span className="text-amber-600 italic">Private</span>
            </h1>
            <p className="text-zinc-400 text-sm font-medium tracking-wide">Especialista em descompressão masculina.</p>
            
            {step > 0 && (
              <nav className="mt-8 flex items-center gap-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex-1 flex flex-col gap-2">
                    <div className={`w-full h-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-amber-600 shadow-[0_0_10px_rgba(217,119,6,0.5)]' : 'bg-zinc-800'}`} />
                    <span className={`text-[9px] uppercase font-bold tracking-widest ${step >= i ? 'text-white' : 'text-zinc-600'}`}>
                      {i === 1 ? 'Onde' : i === 2 ? 'Quando' : 'Resumo'}
                    </span>
                  </div>
                ))}
              </nav>
            )}
          </header>
        )}

        <div>
          {/* ═══════════════════════════════════════════════════════
              STEP 0 — MENU & HOOK (MALE FOCUSED)
          ═══════════════════════════════════════════════════════ */}
          {step === 0 && (
            <section className="animate-fade-up space-y-10">
              <div className="p-6 rounded-3xl border bg-gradient-to-br from-zinc-900 to-[#09090b] border-zinc-800 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <h2 className="font-display text-2xl text-white mb-3 leading-snug">
                  Rotina pesada e dores acumuladas? <br/><span className="text-amber-500">Você merece uma pausa.</span>
                </h2>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  Selecione sua experiência abaixo. O atendimento é feito no seu local de preferência, com excelência e total discrição garantida.
                </p>
                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-zinc-500">
                  <span className="flex items-center gap-1"><Icon name="eye-off" size={14} className="text-amber-500"/> Sigilo 100%</span>
                  <span className="flex items-center gap-1"><Icon name="star" size={14} className="text-amber-500"/> Alto Padrão</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex bg-zinc-900/50 p-1.5 rounded-2xl border border-zinc-800">
                  {[{ id: 'essential', l: 'Alívio & Dor' }, { id: 'premium', l: 'Toque & Sensorial' }, { id: 'immersion', l: 'Imersão Total' }].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 py-3 px-2 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-zinc-800 text-white shadow-lg border border-zinc-700' : 'text-zinc-500 hover:text-zinc-300'}`}>
                      {tab.l}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  {DATA.services.filter(s => s.category === activeTab).map((s: ServiceItem) => (
                    <ServiceCard key={s.id} service={s} isInCart={booking.cart.some(c => c.id === s.id)} onToggle={handleToggleCartItem} onOpenModal={setSelectedService} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════
              STEP 1 — DISCREET LOCATION
          ═══════════════════════════════════════════════════════ */}
          {step === 1 && (
            <section className="animate-fade-up max-w-xl mx-auto space-y-8">
              <header>
                <h2 className="font-display font-bold text-2xl text-white mb-2">Onde será nosso encontro?</h2>
                <p className="text-zinc-400 text-sm">Seus dados estão protegidos sob rigoroso sigilo profissional.</p>
              </header>

              <div className="grid grid-cols-3 gap-3">
                {[ { id: 'hotel', label: 'Hotel', icon: 'building' }, { id: 'motel', label: 'Local Discreto', icon: 'eye-off' }, { id: 'home', label: 'Sua Residência', icon: 'home' } ].map(x => (
                  <button key={x.id} onClick={() => setBooking(b => ({ ...b, locationType: x.id as any }))}
                    className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all border text-center h-28 ${booking.locationType === x.id ? 'bg-amber-600/10 border-amber-500 text-amber-500 shadow-[0_0_15px_rgba(217,119,6,0.15)]' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}>
                    <Icon name={x.icon} size={24} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{x.label}</span>
                  </button>
                ))}
              </div>

              <article className="p-6 rounded-3xl border bg-zinc-900 border-zinc-800 space-y-6">
                <InputField label="Como posso te chamar? (Aceitamos apelidos)" value={user.name} onChange={(e: any) => setUser(u => ({ ...u, name: sanitizeInput(e.target.value) }))} icon="user" placeholder="Seu nome" hasError={hasErrorGlobal && !user.name} />

                {booking.locationType === 'hotel' && (
                  <div className="space-y-5 animate-fade-up">
                    <InputField label="Nome do Hotel" value={booking.address.placeName} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, placeName: sanitizeInput(e.target.value) } }))} icon="building" placeholder="Ex: Ibis Bela Vista" hasError={hasErrorGlobal && !booking.address.placeName} />
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="Quarto/Suíte" value={booking.address.comp} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, comp: sanitizeInput(e.target.value) } }))} placeholder="Ex: 402" />
                      <InputField label="Cidade" value={booking.address.city} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, city: sanitizeInput(e.target.value) } }))} placeholder="Sua cidade" />
                    </div>
                  </div>
                )}
                
                {booking.locationType === 'home' && (
                  <div className="space-y-5 animate-fade-up">
                    <InputField label="CEP" value={booking.address.cep} onChange={handleCepChange} icon="map-pin" placeholder="00000-000" type="tel" maxLength={9} disabled={isFetchingCep} hasError={hasErrorGlobal && !booking.address.street} />
                    <InputField label="Endereço Completo" value={booking.address.street} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, street: sanitizeInput(e.target.value) } }))} placeholder="Rua / Avenida" hasError={hasErrorGlobal && !booking.address.street} />
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="Número" value={booking.address.number} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, number: sanitizeInput(e.target.value) } }))} placeholder="Nº" hasError={hasErrorGlobal && !booking.address.number} />
                      <InputField label="Complemento" value={booking.address.comp} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, comp: sanitizeInput(e.target.value) } }))} placeholder="Apto / Bloco" />
                    </div>
                  </div>
                )}

                {booking.locationType === 'motel' && (
                  <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-start gap-4">
                    <Icon name="shield" size={24} className="text-amber-500 shrink-0" />
                    <p className="text-sm text-zinc-400 leading-relaxed font-medium">Excelente escolha. Para garantir o máximo de discrição, combinaremos o local exato ou a minha suíte particular pelo WhatsApp após o agendamento.</p>
                  </div>
                )}
              </article>
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════
              STEP 2 — EXECUTIVE SCHEDULING
          ═══════════════════════════════════════════════════════ */}
          {step === 2 && (
            <section className="animate-fade-up max-w-xl mx-auto space-y-8">
              <header>
                <h2 className="font-display font-bold text-2xl text-white mb-2">Sua agenda. Seu horário.</h2>
                <p className="text-zinc-400 text-sm">Selecione o momento ideal para a sua descompressão.</p>
              </header>

              <div className="relative w-full">
                <div ref={dateScrollRef} className="flex gap-3 overflow-x-auto snap-x py-2 scrollbar-hide">
                  {daysArray.map((d, idx) => {
                    const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                    return (
                      <button key={idx} onClick={() => setBooking(b => ({ ...b, date: d.toISOString(), time: null }))}
                        className={`snap-center shrink-0 w-[84px] py-4 rounded-2xl flex flex-col items-center gap-1.5 border transition-all ${isSel ? 'bg-amber-600 border-amber-500 text-black shadow-[0_0_15px_rgba(217,119,6,0.3)]' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'}`}>
                        <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">{d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.','')}</span>
                        <span className="font-display text-2xl font-bold leading-none">{d.getDate()}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {booking.date && generateTimeSlots.length > 0 && (
                <div className={`p-6 rounded-3xl border bg-zinc-900 border-zinc-800 animate-fade-up ${hasErrorGlobal && !booking.time ? 'border-red-500/50 animate-shake' : ''}`}>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {generateTimeSlots.map(t => {
                      const isSel = booking.time === t;
                      const isRush = RUSH_HOURS.includes(t) && booking.locationType !== 'motel';
                      return (
                        <button key={t} onClick={() => setBooking(b => ({ ...b, time: t }))}
                          className={`py-4 rounded-xl border text-sm font-bold transition-all relative ${isSel ? 'bg-amber-600 border-amber-500 text-black' : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-600'}`}>
                          {t}
                          {isRush && <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-500" title="Horário de Alta Demanda" />}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-6 flex items-start gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-0.5 shrink-0" />
                    <p>Horários sinalizados possuem alta demanda (+ taxa de deslocamento extra de R$20).</p>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════
              STEP 3 — CHECKOUT & TRUST
          ═══════════════════════════════════════════════════════ */}
          {step === 3 && (
            <section className="animate-fade-up space-y-6 max-w-xl mx-auto">
              
              <article className="p-6 rounded-3xl border bg-zinc-900 border-zinc-800">
                <h3 className="font-display font-bold text-lg text-white mb-6 border-b border-zinc-800 pb-4">Acrescentar à Experiência</h3>
                <div className="space-y-3">
                  {DATA.extras.map((ex: any) => {
                    const isActive = booking.extras[ex.id];
                    return (
                      <button key={ex.id} onClick={() => setBooking(b => ({ ...b, extras: { ...b.extras, [ex.id]: !b.extras[ex.id] } }))}
                        className={`flex items-center justify-between w-full p-4 rounded-2xl border transition-all ${isActive ? 'bg-amber-500/10 border-amber-500/50 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}>
                        <div className="flex items-center gap-3">
                          <Icon name={ex.icon} size={20} className={isActive ? 'text-amber-500' : 'text-zinc-600'} />
                          <div className="text-left">
                            <span className="block text-sm font-bold">{ex.label}</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">+{formatMoney(ex.price)}</span>
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isActive ? 'border-amber-500 bg-amber-500 text-black' : 'border-zinc-700'}`}>
                          {isActive && <Icon name="check" size={12} />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </article>

              <article className={`p-6 rounded-3xl border bg-zinc-900 border-zinc-800 ${hasErrorGlobal && !booking.payment ? 'border-red-500/50 animate-shake' : ''}`}>
                <h3 className="font-display font-bold text-lg text-white mb-6 border-b border-zinc-800 pb-4">Forma de Pagamento (No Local)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[ { id: 'pix', label: 'Pix (Recomendado)', icon: 'smartphone' }, { id: 'card', label: 'Cartão de Crédito', icon: 'credit-card' }, { id: 'money', label: 'Espécie', icon: 'banknote' } ].map(p => (
                    <button key={p.id} onClick={() => setBooking(b => ({ ...b, payment: p.id }))}
                      className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${booking.payment === p.id ? 'bg-amber-600 border-amber-500 text-black' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-600'}`}>
                      <Icon name={p.icon} size={24} />
                      <span className="text-xs font-bold uppercase tracking-widest">{p.label}</span>
                    </button>
                  ))}
                </div>
              </article>

              <article className="p-6 rounded-3xl border bg-zinc-900 border-zinc-800 text-zinc-300">
                <h3 className="font-display font-bold text-lg text-white mb-4">Resumo Executivo</h3>
                
                <div className="space-y-3 mb-6 pb-6 border-b border-zinc-800">
                  {booking.cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm font-bold">
                      <span>{item.title}</span>
                      <span className="text-white">{formatMoney(item.price)}</span>
                    </div>
                  ))}
                  {Object.keys(booking.extras).filter(k => booking.extras[k]).map(k => {
                    const ex = DATA.extras.find((e: any) => e.id === k);
                    return ex ? (
                      <div key={k} className="flex justify-between items-center text-sm font-medium text-zinc-500">
                        <span>{ex.label}</span>
                        <span>+{formatMoney(ex.price)}</span>
                      </div>
                    ) : null;
                  })}
                  {financials.rushFee > 0 && (
                    <div className="flex justify-between items-center text-sm font-medium text-amber-500/70">
                      <span>Taxa Deslocamento (Pico)</span>
                      <span>+{formatMoney(financials.rushFee)}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Investimento Final</span>
                  <span className="font-display text-4xl text-amber-500 leading-none">{formatMoney(financials.total)}</span>
                </div>
              </article>
            </section>
          )}

        </div>
      </main>

      {/* ── STICKY BOTTOM NAV ── */}
      {step >= 0 && step < 4 && booking.cart.length > 0 && (
        <nav className="fixed bottom-0 inset-x-0 p-4 z-40 animate-slide-up pointer-events-none">
          <div className="max-w-xl mx-auto pointer-events-auto rounded-2xl overflow-hidden border bg-zinc-950/90 backdrop-blur-xl border-zinc-800 shadow-2xl p-4 flex items-center justify-between gap-4">
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} className="w-12 h-12 flex items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white shrink-0">
                <Icon name="chevron-left" size={20} />
              </button>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-0.5 truncate">Total do Serviço</p>
              <p className="font-display font-bold text-xl text-white leading-none">{formatMoney(step === 3 ? financials.total : financials.sub)}</p>
            </div>
            <Button size="lg" className="px-8" onClick={handleNextStep}>
              {step === 3 ? 'Finalizar e Enviar' : 'Continuar'} {step !== 3 && <Icon name="chevron-right" size={16}/>}
            </Button>
          </div>
        </nav>
      )}
    </>
  );
}
