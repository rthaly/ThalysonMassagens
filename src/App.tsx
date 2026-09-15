import React, { useState, useEffect, useMemo, useRef, useCallback, memo } from 'react';

// ==================================================================================
// CONFIGURAÇÕES E TOKENS (SEM BANCO DE DADOS)
// ==================================================================================
const CONFIG = {
  PHONE: "5517991360413",
  INSTAGRAM_URL: "https://instagram.com/relaxarhojesp",
  STORAGE_KEY: '@thaly_app_v28_premium',
  PIX_KEY: "62.922.530/0001-14",
  START_HOUR: 9,
  END_HOUR: 22,
};

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
  'heart': 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  'instagram': 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M2 8a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8z',
  'plus': 'M12 5v14 M5 12h14',
  'refresh-cw': 'M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0 0 20.49 15',
  'message-circle': 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8.9h.5a8.48 8.48 0 0 1 8 8v.5z',
};

// ==================================================================================
// ESTILOS GLOBAIS (MODO ESCURO FIXO)
// ==================================================================================
const GlobalStyles = memo(() => (
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
      --c-bg: #11141a;
      --c-surface: #181c25;
      --c-border: rgba(255,255,255,0.08);
      --c-text: #f4f4f5;
      --c-text-muted: #a1a1aa; 
      --c-amber: #f59e0b;
    }

    html, body {
      background-color: var(--c-bg);
      color: var(--c-text);
      font-family: var(--font-sans);
      overscroll-behavior-y: none;
      -webkit-tap-highlight-color: transparent;
      line-height: 1.5;
      font-size: 15px; 
    }

    h1, h2, h3, h4, h5, h6 { font-weight: 700; letter-spacing: -0.01em; }
    .font-display { font-family: var(--font-display); font-weight: 700; }
    *:focus-visible { outline: 2px solid var(--c-amber); outline-offset: 4px; }
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
    .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
    @keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-3px, 0, 0); } 40%, 60% { transform: translate3d(3px, 0, 0); } }

    button { position: relative; overflow: hidden; cursor: pointer; border: none; }
    .input-field:focus { outline: none; border-color: var(--c-amber); box-shadow: 0 0 0 3px rgba(245,158,11,0.15); }
    .break-words-all { word-break: break-word; overflow-wrap: break-word; hyphens: auto; }
  `}} />
));

// ==================================================================================
// UTILITÁRIOS
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
// COMPONENTES BÁSICOS
// ==================================================================================
const Icon = memo(({ name, size = 24, className = '' }: { name: string; size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`} aria-hidden="true">
    <path d={ICON_PATHS[name] || ''} />
  </svg>
));

const Button = memo(({ children, onClick, variant = 'primary', size = 'md', disabled = false, full = false, icon, className = '', loading = false }: any) => {
  const base = "relative inline-flex items-center justify-center font-bold tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] gap-2 shrink-0 overflow-hidden";
  const variants: Record<string, string> = {
    primary: "bg-amber-600 text-white hover:bg-amber-500 shadow-md shadow-amber-900/20",
    secondary: "bg-zinc-800 border border-zinc-700 text-white hover:bg-zinc-700",
    whatsapp: "bg-[#25D366] text-white hover:bg-[#22c55e] shadow-md shadow-green-900/20",
    outline: "border border-current text-current hover:bg-white/5",
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

const InputField = memo(({ label, value, onChange, placeholder, icon, type = 'text', hasError = false, disabled = false, maxLength, id }: any) => {
  const inputId = id || `input-${label?.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div className={`space-y-1.5 w-full ${hasError ? 'animate-shake' : ''}`}>
      {label && <label htmlFor={inputId} className={`block text-[10px] sm:text-xs font-bold uppercase tracking-widest pl-1 ${hasError ? 'text-red-400' : 'text-zinc-400'}`}>{label}</label>}
      <div className="relative group">
        {icon && <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${hasError ? 'text-red-400' : 'text-zinc-500'}`}><Icon name={icon} size={20} /></div>}
        <input id={inputId} type={type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled} maxLength={maxLength}
          className={`input-field font-medium w-full min-h-[52px] rounded-xl text-sm transition-all border outline-none disabled:opacity-50 ${icon ? 'pl-12 pr-4' : 'px-4'} ${hasError ? 'border-red-500/50 bg-red-950/10 text-red-400' : 'border-zinc-700 bg-white/5 text-white placeholder:text-zinc-500 focus:border-amber-500 focus:bg-white/10'}`} />
      </div>
    </div>
  );
});

// ==================================================================================
// DADOS (COPY DIRETA E ESTRATÉGICA)
// ==================================================================================
const DATA = {
  services: [
    { id: 'pes', category: 'express', min: 40, price: 110, icon: "user-check", tag: "ALÍVIO PÉS", title: "Reflexologia Podal", desc: "Alívio rápido e completo para pés cansados após longas jornadas.", details: "1. Foco exclusivo na sola dos pés.\n2. Pressão em pontos de tensão.\n3. Descanso imediato." },
    { id: 'relaxante', category: 'relax', min: 40, price: 180, icon: "user-check", tag: "ALÍVIO MUSCULAR", title: "Massagem Clássica", desc: "Focada em tirar dores e nós musculares. Estritamente terapêutica, sem toques íntimos.", details: "1. Massagem no corpo todo (costas, pernas, braços).\n2. Desfaz nós e tensões pesadas.\n3. Zero toques em áreas íntimas." },
    { id: 'sensitiva', category: 'final', min: 60, price: 200, icon: "sparkles", tag: "DESPERTAR", title: "Massagem Sensitiva", desc: "Clássica para aliviar as costas, seguida de toques para relaxamento mental. Finalização tântrica manual.", details: "1. Massagem para soltar a musculatura pesada.\n2. Toques focados em relaxamento profundo.\n3. Finalização manual focada no alívio (Lingam).\n4. Não há penetração ou ato sexual." },
    { id: 'mista', category: 'final', min: 60, price: 250, icon: "zap", tag: "PELE A PELE", title: "Experiência Fusion", desc: "O equilíbrio. Massagem para dores e depois contato físico próximo (atendo de cueca) com finalização intensa.", details: "1. Massagem para tirar as travas.\n2. Contato físico direto corpo a corpo.\n3. Estímulos intensos.\n4. Finalização tântrica manual poderosa." },
    { id: 'reversa', category: 'final', min: 60, price: 400, icon: "refresh-cw", tag: "SEU CONTROLE", title: "Massagem Reversa", desc: "Começa comigo tirando suas tensões. Depois, você assume o controle do ritmo da sessão.", details: "1. Massagem clássica inicial.\n2. O controle da sessão passa para você.\n3. Liberdade para guiar os toques.\n4. Finalização manual mútua." },
    { id: 'nuru', category: 'final', min: 60, price: 350, icon: "star", popular: true, tag: "O ÁPICE", title: "Massagem Nuru", desc: "Deslizamento corpo a corpo. Contato direto e contínuo com gel para soltar as travas da rotina e esvaziar a mente.", details: "1. Nós dois sem roupas desde o início.\n2. Deslizamento fluido com gel especial.\n3. Relaxamento extremo do sistema nervoso.\n4. Finalização manual focada no seu prazer absoluto." },
    { id: 'depilacao', category: 'care', min: 60, price: 107, icon: "scissors", tag: "ESTÉTICA", title: "Aparo de Pelos", desc: "Aparo com máquina para manter a estética e o conforto corporal.", details: "1. Uso de máquina (pente 0 ou 3).\n2. Estética agradável e higiene." }
  ],
  plans: [
    { id: 'pack_classic4', type: 'pack', title: "Mês Sem Dor (4x)", price: 576, fullPrice: 720, savings: 144, desc: "Alívio muscular contínuo. Zero toques íntimos. 1x por semana.", details: "4x Massagem Clássica\nAgendamento flexível.", tag: "CLÁSSICO", icon: "calendar" },
    { id: 'pack_tantric', type: 'pack', title: "Jornada Tântrica (3x)", price: 640, fullPrice: 800, savings: 160, desc: "Três encontros escalando o nível de intimidade e relaxamento.", details: "1x Sensitiva (Despertar)\n1x Fusion (Pele a pele)\n1x Nuru (Entrega total)", tag: "IMERSÃO", icon: "heart" },
  ],
  extras: [
    { id: 'hair_trim', price: 57, icon: "scissors", label: "Aparo de Pelos (Até 2 áreas)", desc: "" },
    { id: 'more_time', price: 77, icon: "clock", label: "Sessão mais longa (+30 Minutos)", desc: "" },
    { id: 'aroma', price: 17, icon: "sparkles", label: "Aromaterapia Relaxante", desc: "" }
  ],
  rules: [
    { icon: "shield", title: "Sigilo Absoluto", description: "O que acontece na sessão, morre na sessão. Privacidade garantida para homens sigilosos ou casados. Ninguém precisa saber." },
    { icon: "hand", title: "Limites Claros", description: "Sessões com finalização usam apenas técnicas manuais para relaxamento profundo. Não realizo penetração ou ato sexual." },
    { icon: "shower", title: "Higiene Básica", description: "Um banho quente antes do encontro é inegociável para o nosso conforto." }
  ],
  reviews: [
    { n: "Gustavo H.", loc: "Bela Vista - SP", t: "O Thalyson foi profissional. O toque pele a pele me deixou nas nuvens e tirou meu estresse. Discrição total.", serv: "Experiência Fusion", s: 5 },
    { n: "L. (Sigiloso)", loc: "Santa Fé do Sul", t: "Precisava desse alívio sem julgamentos. Sou casado, o sigilo foi perfeito e a massagem me fez relaxar de verdade.", serv: "Massagem Sensitiva", s: 5 },
    { n: "Marcos", loc: "Consolação - SP", t: "Fui na suíte dele. Clima perfeito. A Nuru com aquele gel que desliza pelo corpo todo é um absurdo de gostoso. Dormi pesado depois.", serv: "Massagem Nuru", s: 5 },
    { n: "Felipe", loc: "Londrina", t: "A massagem clássica é pesada na medida certa. Tirou uns nós das minhas costas que me atormentavam há semanas.", serv: "Massagem Clássica", s: 5 }
  ]
};

// ==================================================================================
// APP PRINCIPAL
// ==================================================================================
export default function App() {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [activeTab, setActiveTab] = useState('single');
  const [toasts, setToasts] = useState<{ id: number; msg: string; type: 'success' | 'error' }[]>([]);
  const [termsOpen, setTermsOpen] = useState(false);
  const [showRoulette, setShowRoulette] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasErrorGlobal, setHasErrorGlobal] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  
  const [user, setUser] = useState({ name: '', xp: 0, coupons: [] as any[], hasSeenWelcome: false, ordersCount: 142 });
  const [booking, setBooking] = useState({ 
    cart: [] as any[], extras: {} as any, date: null as string | null, time: null as string | null, 
    locationType: 'home', address: { cep: '', street: '', number: '', district: '', city: '', comp: '', placeName: '' }, 
    payment: '', termsAccepted: false, appliedCoupon: null as any
  });

  const dateScrollRef = useRef<HTMLDivElement>(null);

  // EFEITO MODO SIGILO (Altera o título se o cara mudar de aba)
  useEffect(() => {
    const handleVisibility = () => { document.title = document.hidden ? "Nova Guia" : "Thalyson Massagens"; };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Carrega e salva dados no localStorage
  useEffect(() => {
    const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.user) setUser(u => ({ ...u, ...parsed.user }));
        if (parsed.booking) setBooking(b => ({ ...b, ...parsed.booking }));
        if (typeof parsed.step === 'number') setStep(parsed.step);
      } catch {}
    }
    setTimeout(() => setLoading(false), 500);
  }, []);

  useEffect(() => {
    if (!loading) localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({ user, booking, step }));
  }, [user, booking, step, loading]);

  useEffect(() => {
    if (!loading && !user.hasSeenWelcome) { const t = setTimeout(() => setShowRoulette(true), 1500); return () => clearTimeout(t); }
  }, [loading, user.hasSeenWelcome]);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [step]);

  const addToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts(p => [...p.slice(-2), { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);

  const openExternal = (platform: 'whatsapp' | 'instagram', text?: string) => {
    const url = platform === 'whatsapp' ? `https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(text || '')}` : CONFIG.INSTAGRAM_URL;
    window.open(url, '_blank');
  };

  const toggleCartItem = (item: any) => {
    vibrate(50);
    setBooking(prev => {
      const exists = prev.cart.find(c => c.id === item.id);
      return { ...prev, cart: exists ? prev.cart.filter(c => c.id !== item.id) : [...prev.cart, item], payment: '', termsAccepted: false };
    });
    setSelectedService(null);
  };

  const financials = useMemo(() => {
    let sub = 0;
    booking.cart.forEach(item => sub += item.price);
    Object.keys(booking.extras).forEach(k => {
      if (booking.extras[k]) sub += DATA.extras.find(e => e.id === k)?.price || 0;
    });
    const rushFee = (RUSH_HOURS.includes(booking.time || '') && booking.locationType !== 'motel') ? RUSH_FEE : 0;
    const disc = booking.appliedCoupon ? booking.appliedCoupon.val : 0;
    const total = Math.max(0, sub - disc) + rushFee;
    return { sub, total, disc, rushFee };
  }, [booking]);

  const isStepValid = () => {
    if (step === 0) return booking.cart.length > 0;
    if (step === 1) return user.name.trim().length > 1; // Simplifiquei a checagem de endereço pra focar no fluxo
    if (step === 2) return !!(booking.date && booking.time);
    if (step === 3) return !!(booking.payment && booking.termsAccepted);
    return true;
  };

  const handleNextStep = () => {
    if (!isStepValid()) {
      vibrate([50, 50]); setHasErrorGlobal(true); setTimeout(() => setHasErrorGlobal(false), 500);
      return;
    }
    vibrate(30);
    if (step === 3) {
      setUser(u => ({ ...u, xp: u.xp + Math.floor(financials.total * 0.15) }));
      setStep(4);
    } else {
      setStep(s => s + 1);
    }
  };

  const generateWhatsAppMsg = () => {
    const servs = booking.cart.map(i => `▪️ *${i.title}*`).join('\n');
    let loc = booking.locationType === 'home' ? 'Na minha residência' : booking.locationType === 'motel' ? 'Sua Suíte' : 'Hotel';
    return `*PEDIDO DE SESSÃO*\nOlá Thalyson. Preciso de alívio.\n\n👤 *Nome:* ${user.name}\n📅 *Quando:* ${new Date(booking.date!).toLocaleDateString('pt-BR')} às ${booking.time}\n\n*Serviços:*\n${servs}\n\n*Onde:* ${loc}\n*Total:* ${formatMoney(financials.total)}\n*Pagamento:* ${booking.payment.toUpperCase()}\n\n_Estou ciente e aceito as regras de sigilo e limites da sessão._`;
  };

  if (loading) return <div className="min-h-screen bg-[#11141a] flex items-center justify-center"><div className="w-16 h-16 bg-amber-600 rounded-2xl animate-pulse flex items-center justify-center text-white font-display text-2xl">T</div></div>;

  return (
    <>
      <GlobalStyles />
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 pointer-events-none w-[90vw] max-w-sm">
        {toasts.map(t => (
          <div key={t.id} className={`animate-toast-in pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-xl bg-[#181c25]/95 backdrop-blur-md ${t.type === 'error' ? 'border-red-500/50 text-red-100' : 'border-zinc-700 text-white'}`}>
            <span className="text-sm font-bold">{t.msg}</span>
          </div>
        ))}
      </div>

      <main className="min-h-screen relative z-10 pb-40 px-4 sm:px-6 max-w-xl mx-auto">
        {step !== 4 && (
          <header className="pt-8 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-2xl font-bold text-white mb-1">Thalyson</h1>
                <p className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Ambiente Sigiloso
                </p>
              </div>
              <button onClick={() => openExternal('whatsapp', 'Oi, estava no site.')} className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400">
                <Icon name="message-circle" size={18} />
              </button>
            </div>
          </header>
        )}

        {/* STEP 0: SERVIÇOS */}
        {step === 0 && (
          <div className="space-y-6 animate-fade-up">
            <div className="p-5 rounded-3xl border bg-[#181c25] border-zinc-800 flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-amber-900/50 bg-zinc-800 shrink-0">
                 <img src="https://i.ibb.co/gZxp3Dwz/Screenshot-1.png" alt="Thalyson" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-white font-display text-lg">Olá {user.name ? user.name.split(' ')[0] : 'visitante'},</h2>
                <p className="text-xs text-zinc-400 mt-1">Espaço livre de julgamentos para homens soltarem a tensão da rotina.</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setActiveTab('single')} className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase transition-all ${activeTab === 'single' ? 'bg-amber-600 text-white' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'}`}>Avulsas</button>
              <button onClick={() => setActiveTab('packs')} className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase transition-all ${activeTab === 'packs' ? 'bg-amber-600 text-white' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'}`}>Combos</button>
            </div>

            <div className="space-y-4">
              {(activeTab === 'single' ? DATA.services : DATA.plans).map((s: any) => {
                const inCart = booking.cart.some(c => c.id === s.id);
                return (
                  <div key={s.id} onClick={() => setSelectedService(s)} className={`p-4 rounded-2xl border cursor-pointer transition-all ${inCart ? 'bg-amber-900/20 border-amber-500/50' : 'bg-[#181c25] border-zinc-800'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-white">{s.title}</h3>
                      <span className="font-display text-amber-500">{formatMoney(s.price)}</span>
                    </div>
                    <p className="text-xs text-zinc-400 line-clamp-2">{s.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 1: LOCAL & DADOS */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-up">
            <h2 className="font-display font-bold text-2xl text-white text-center">Onde será?</h2>
            <div className="grid grid-cols-3 gap-3">
              {[{ id: 'home', label: 'Residência', icon: 'home' }, { id: 'motel', label: 'Minha Suíte', icon: 'bed' }, { id: 'hotel', label: 'Hotel', icon: 'building' }].map(x => (
                <button key={x.id} onClick={() => setBooking(b => ({ ...b, locationType: x.id }))}
                  className={`p-4 rounded-2xl flex flex-col items-center gap-2 border ${booking.locationType === x.id ? 'bg-amber-600 border-amber-500 text-white' : 'bg-[#181c25] border-zinc-800 text-zinc-400'}`}>
                  <Icon name={x.icon} size={24} /><span className="text-[10px] font-bold uppercase">{x.label}</span>
                </button>
              ))}
            </div>
            <div className="p-5 rounded-3xl border bg-[#181c25] border-zinc-800 space-y-4">
              <InputField label="Seu Nome ou Apelido" value={user.name} onChange={(e: any) => setUser(u => ({ ...u, name: e.target.value }))} icon="user" hasError={hasErrorGlobal && user.name.length < 2} />
              {booking.locationType === 'home' && <InputField label="Endereço Completo (Rua, Número, Bairro)" value={booking.address.street} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, street: e.target.value } }))} />}
              {booking.locationType === 'hotel' && <InputField label="Nome do Hotel e Quarto" value={booking.address.placeName} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, placeName: e.target.value } }))} />}
              {booking.locationType === 'motel' && <p className="text-xs text-zinc-400">O endereço da minha suíte (Bela Vista) será enviado no WhatsApp após a confirmação para garantir a privacidade de ambos.</p>}
            </div>
          </div>
        )}

        {/* STEP 2: DATA/HORA */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-up">
            <h2 className="font-display font-bold text-2xl text-white text-center">Quando?</h2>
            <div className="flex gap-3 overflow-x-auto snap-x py-2 scrollbar-hide w-full" ref={dateScrollRef}>
              {[...Array(14)].map((_, i) => {
                const d = new Date(); d.setDate(d.getDate() + i);
                const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                return (
                  <button key={i} onClick={() => setBooking(b => ({ ...b, date: d.toISOString(), time: null }))}
                    className={`snap-center shrink-0 w-20 py-4 rounded-2xl flex flex-col items-center gap-1 border ${isSel ? 'bg-amber-600 border-amber-500 text-white' : 'bg-[#181c25] border-zinc-800 text-zinc-400'}`}>
                    <span className="font-display text-2xl">{d.getDate()}</span>
                    <span className="text-[10px] uppercase font-bold">{d.toLocaleDateString('pt-BR', { weekday: 'short' })}</span>
                  </button>
                );
              })}
            </div>
            {booking.date && (
              <div className="grid grid-cols-3 gap-3">
                {['10:00', '13:00', '15:00', '18:00', '20:00', '22:00'].map(t => (
                  <button key={t} onClick={() => setBooking(b => ({ ...b, time: t }))}
                    className={`py-3 rounded-xl font-bold border ${booking.time === t ? 'bg-amber-600 border-amber-500 text-white' : 'bg-[#181c25] border-zinc-800 text-zinc-400'}`}>{t}</button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 3: PAGAMENTO E REGRAS */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-up">
            <div className="p-5 rounded-3xl border bg-[#181c25] border-zinc-800">
              <h3 className="font-display font-bold text-lg text-white mb-3">Pagamento no Local</h3>
              <div className="space-y-3">
                {['PIX', 'Cartão', 'Dinheiro'].map(p => (
                  <button key={p} onClick={() => setBooking(b => ({ ...b, payment: p }))}
                    className={`w-full text-left p-4 rounded-2xl border font-bold ${booking.payment === p ? 'bg-amber-600 border-amber-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}>{p}</button>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-3xl border bg-[#181c25] border-zinc-800">
              <h3 className="font-display font-bold text-lg text-white mb-3">Acordos de Sessão</h3>
              <div className="space-y-4 mb-5">
                {DATA.rules.map((r, i) => (
                  <div key={i} className="flex gap-3 text-sm text-zinc-300">
                    <Icon name={r.icon} size={20} className="text-amber-500 shrink-0" />
                    <p><strong>{r.title}:</strong> {r.description}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => setBooking(b => ({ ...b, termsAccepted: !b.termsAccepted }))}
                className={`w-full py-4 rounded-xl font-bold border transition-all ${booking.termsAccepted ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-zinc-900 border-zinc-700 text-zinc-400'}`}>
                {booking.termsAccepted ? 'Acordos Aceitos' : 'Li e aceito as regras'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SUCESSO */}
        {step === 4 && (
          <div className="min-h-[70vh] flex flex-col items-center justify-center text-center animate-scale-in">
            <div className="w-20 h-20 rounded-full border-4 border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center mb-6">
              <Icon name="check" size={32} className="text-emerald-500" />
            </div>
            <h2 className="font-display font-bold text-2xl text-white mb-2">Tudo Certo!</h2>
            <p className="text-zinc-400 mb-8 text-sm">Me envie o resumo no WhatsApp para confirmarmos seu horário e o endereço.</p>
            <Button variant="whatsapp" full size="lg" icon="message" onClick={() => openExternal('whatsapp', generateWhatsAppMsg())}>
              Enviar para WhatsApp
            </Button>
            <button onClick={() => setStep(0)} className="mt-6 text-xs text-zinc-500 font-bold uppercase">Voltar ao início</button>
          </div>
        )}
      </main>

      {/* FOOTER BARRA DE PROGRESSO E CARRINHO */}
      {step >= 0 && step < 4 && booking.cart.length > 0 && (
        <nav className="fixed bottom-0 inset-x-0 p-4 z-40 bg-[#11141a]/90 backdrop-blur-md border-t border-zinc-800">
          <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
            {step > 0 && <button onClick={() => setStep(s => s - 1)} className="w-12 h-12 rounded-xl bg-zinc-800 text-zinc-400 flex items-center justify-center"><Icon name="chevron-left" /></button>}
            <div className="flex-1">
              <p className="text-[10px] text-zinc-500 font-bold uppercase">Total</p>
              <p className="font-display text-xl text-white">{formatMoney(financials.total)}</p>
            </div>
            <Button onClick={handleNextStep} size="lg" className="px-8">{step === 3 ? 'Finalizar' : 'Avançar'}</Button>
          </div>
        </nav>
      )}

      {/* MODAL SERVIÇO */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#181c25] w-full max-w-sm rounded-3xl p-5 border border-zinc-800 animate-slide-up relative">
            <button onClick={() => setSelectedService(null)} className="absolute top-4 right-4 text-zinc-500"><Icon name="x" size={20} /></button>
            <h3 className="font-display text-xl text-white mb-2 pr-6">{selectedService.title}</h3>
            <p className="text-amber-500 font-display text-2xl mb-4">{formatMoney(selectedService.price)}</p>
            <p className="text-zinc-300 text-sm mb-6">{selectedService.desc}</p>
            <div className="space-y-2 mb-6">
              {selectedService.details.split('\n').map((line: string, i: number) => (
                <p key={i} className="text-xs text-zinc-400 flex gap-2"><Icon name="check" size={14} className="text-amber-500 shrink-0" /> {line.replace(/^\d+\.\s*/, '')}</p>
              ))}
            </div>
            <Button full size="lg" onClick={() => toggleCartItem(selectedService)}>
              {booking.cart.some(c => c.id === selectedService.id) ? 'Remover' : 'Selecionar'}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
