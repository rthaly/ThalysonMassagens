import * as React from 'react';
import { useState, useEffect, useMemo, useRef } from 'react';

// ==================================================================================
// ESTILOS E ICONES
// ==================================================================================

const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');
    * { font-family: 'Inter', sans-serif; }
    h1, h2, h3, h4, h5, h6 { font-family: 'Poppins', sans-serif; }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  `}} />
);

// Sistema de Ícones SVG (Inline e Monocromáticos)
const Icon = ({ name, size = 20, className = "" }: { name: string, size?: number, className?: string }) => {
  const paths: Record<string, string> = {
    // Serviços
    'user-check': 'M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M8.5 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M20 8v6M23 11h-6',
    'sparkles': 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962l6.135-1.583A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0l1.582 6.135a2 2 0 0 0 1.437 1.437l6.135 1.583a.5.5 0 0 1 0 .962l-6.135 1.583a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z',
    'flame': 'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-2.76-4-5-4-2.24 0-5 2.62-5 4a2.5 2.5 0 0 0 2.5 2.5h2.5zm4.5-5c0-3.5-3-5.5-3-5.5S15 6 15 9.5c0 1.1-.3 2.1-.9 3 .6.9 1.9 1 1.9 1s-1.4 3-4 3c-1.1 0-2.3-.3-3.2-1 .9-1.2 2.7-3.8 2.7-6z',
    'package': 'M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12',
    'star': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    'layers': 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    
    // Extras
    'clock': 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', // Shield icon used for rules, swapped logic below
    'watch': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2',
    'hand': 'M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0',
    'flower': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 8a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4z',
    'scissors': 'M6 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 0v8a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4l4-4m-6 4v-4l-4 4',
    'pill': 'M10.5 16.5a6 6 0 0 1-8.49-8.49l8.49-8.49a6 6 0 0 1 8.49 8.49l-8.49 8.49z',
    
    // UI
    'home': 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
    'building': 'M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2 M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2',
    'bed': 'M2 4v16M22 4v16M2 8h18a2 2 0 0 1 2 2v10',
    'smartphone': 'M5 17h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2zM12 15h.01',
    'credit-card': 'M22 10v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6 M1 10V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4',
    'banknote': 'M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zM12 6v12M12 8a4 4 0 0 1 0 8',
    'shield': 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    'shower': 'M9 22V5a3 3 0 0 1 3-3 3 3 0 0 1 3 3v17',
    'alert-circle': 'M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zM12 8v4M12 16h.01',
    'check': 'M20 6L9 17l-5-5',
    'x': 'M18 6L6 18M6 6l12 12',
    'chevron-right': 'M9 18l6-6-6-6',
    'chevron-left': 'M15 18l-6-6 6-6',
    'chevron-down': 'M6 9l6 6 6-6',
    'calendar': 'M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V9h14v11z',
    'map-pin': 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    'user': 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    'settings': 'M12.22 2h-.44a2 2 0 0 1-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
    'share': 'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8 M16 6l-4-4-4 4 M12 2v13',
    'globe': 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
    'sun': 'M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
    'moon': 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
    'gift': 'M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z',
    'message': 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z',
    'award': 'M12 15l-2 5-9-9 9-9 9 9-9 9-2-5',
    'trophy': 'M6 9H4.5a2.5 2.5 0 0 1 0-5H6 M18 9h1.5a2.5 2.5 0 0 0 0-5H18 M4 22h16 M12 15l-4-4V2h8v9l-4 4z M12 15v7'
  };

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <path d={paths[name] || ''} />
    </svg>
  );
};

// ==================================================================================
// CONFIGURAÇÃO
// ==================================================================================
const CONFIG = {
  PHONE: "5517991360413",
  INSTAGRAM_URL: "https://instagram.com/thalyson.massagens",
  STORAGE_KEY: '@thaly_app_v18_secure',
  PIX_KEY: "62.922.530/0001-14",
  LOCALE_PT: 'pt-BR',
  LOCALE_EN: 'en-US',
  SECRET_TOKEN: 'THALY_SECURE_V5',
  START_HOUR: 9,
  END_HOUR: 20,
  MAX_STORAGE_SIZE: 5000 
} as const;

// Types
interface ServiceItem {
  id: string;
  min: number;
  price: number;
  icon: string;
  tag: string;
  title: string;
  desc: string;
  details: string;
  fullPrice?: number;
  savings?: number;
  type?: string;
}

interface Coupon {
  id: string;
  val: number;
  title: string;
  code: string;
}

interface Review {
  n: string;
  loc: string;
  t: string;
  s: number;
}

interface UserData {
  name: string;
  xp: number;
  coupons: Coupon[];
  usedCoupons: string[];
  hasSeenWelcome: boolean;
  ordersCount: number;
  lastActivity: string;
}

interface Address {
  street: string;
  number: string;
  district: string;
  city: string;
  comp: string;
  placeName: string;
}

interface BookingData {
  type: 'single' | 'pack';
  item: ServiceItem | null;
  extras: Record<string, boolean>;
  date: string | null;
  time: string | null;
  locationType: 'home' | 'motel' | 'hotel';
  address: Address;
  payment: string;
  appliedCoupon: Coupon | null;
  termsAccepted: boolean;
  bookingId: string;
}

interface Rule {
  icon: string;
  title: string;
  description: string;
}

// ==================================================================================
// COMPONENTES REUTILIZÁVEIS
// ==================================================================================
const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  full = false,
  icon,
  className = '',
  loading = false
}: any) => {
  const baseStyle = "inline-flex items-center justify-center font-bold tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl select-none active:scale-[0.97] font-poppins gap-2";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/25",
    secondary: "bg-zinc-800 border-2 border-zinc-700 text-zinc-100 hover:bg-zinc-700",
    whatsapp: "bg-[#25D366] text-white hover:bg-[#20BD5A] shadow-lg shadow-green-500/20",
    outline: "bg-transparent border-2 border-zinc-600 text-zinc-300 hover:border-zinc-400",
    ghost: "bg-transparent text-zinc-400 hover:text-white hover:bg-white/5"
  };
  const sizes = {
    sm: "h-10 text-sm px-4",
    md: "h-12 text-sm px-6",
    lg: "h-14 text-base px-8",
    xl: "h-16 text-base px-10"
  };
  
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyle}
        ${variants[variant as keyof typeof variants] || variants.primary}
        ${sizes[size as keyof typeof sizes]}
        ${full ? 'w-full' : ''}
        ${className}
      `}
    >
      {loading ? (
        <span className="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
      ) : (
        <>
          {icon && <Icon name={icon} size={20} />}
          {children}
        </>
      )}
    </button>
  );
};

const Card = ({ children, className = '', onClick, active = false, isDark = true }: any) => (
  <div
    onClick={onClick}
    className={`
      relative p-8 rounded-3xl transition-all duration-300 flex flex-col h-full font-poppins
      ${onClick ? 'cursor-pointer active:scale-[0.98] hover:-translate-y-1' : ''}
      ${active
        ? 'bg-blue-900/10 border-2 border-blue-500 shadow-lg shadow-blue-500/20'
        : isDark
          ? 'bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 hover:border-zinc-700'
          : 'bg-white border border-slate-200 shadow-lg hover:border-slate-300'
      }
      ${className}
    `}
  >
    {children}
  </div>
);

const InputField = ({ label, value, onChange, placeholder, icon, type = "text", isDark = true }: any) => (
  <div className="space-y-2 w-full">
    {label && (
      <label className={`text-xs font-bold uppercase tracking-wider font-poppins ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
        {label}
      </label>
    )}
    <div className="relative">
      {icon && (
        <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
          <Icon name={icon} size={20} />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full h-12 rounded-xl outline-none text-sm font-medium transition-all font-poppins
          ${icon ? 'pl-12 pr-4' : 'px-4'}
          ${isDark
            ? 'bg-zinc-900 border-2 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500'
            : 'bg-white border-2 border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-blue-600'
          }
        `}
      />
    </div>
  </div>
);

const ReviewCard = ({ review, isDark }: { review: Review; isDark: boolean }) => (
  <div
    className={`
      w-full h-full p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 border
      ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200 shadow-md'}
    `}
  >
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${isDark ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
          {review.n.charAt(0)}
        </div>
        <div>
          <span className={`text-sm font-semibold block ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>{review.n}</span>
          <span className={`text-xs ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{review.loc}</span>
        </div>
      </div>
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Icon key={i} name="star" size={14} className={i < review.s ? 'text-yellow-400 fill-yellow-400' : isDark ? 'text-zinc-700' : 'text-slate-400'} />
        ))}
      </div>
    </div>
    <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
      {review.t}
    </p>
  </div>
);

const SmartTimer = ({ isDark, text }: any) => {
  const [time, setTime] = useState(600);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => prev <= 0 ? 600 : prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  
  const format = (t: number) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };
  
  const isUrgent = time < 60;
  return (
    <div
      className={`
        flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all font-inter
        ${isUrgent
          ? 'bg-red-500/10 border-red-500/30 text-red-400'
          : isDark
            ? 'bg-blue-500/5 border-blue-500/20 text-blue-400'
            : 'bg-blue-50 border-blue-200 text-blue-700'
        }
      `}
    >
      <Icon name="watch" size={20} className={isUrgent ? 'animate-pulse' : ''} />
      <span className="text-sm font-semibold">
        {text}: <span className="font-mono">{format(time)}</span>
      </span>
    </div>
  );
};

const FAQItem = ({ q, a, isDark }: { q: string; a: string; isDark: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`border-b ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left group font-inter"
      >
        <span className={`text-sm font-semibold font-inter ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{q}</span>
        <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
          <Icon name="chevron-down" size={20} />
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-5' : 'max-h-0'}`}>
        <p className={`text-sm font-inter ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{a}</p>
      </div>
    </div>
  );
};

const RuleItem = ({ rule, isDark }: { rule: Rule; isDark: boolean }) => (
  <div className={`flex gap-4 p-5 rounded-2xl border ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-slate-200'}`}>
    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
      <Icon name={rule.icon} size={24} />
    </div>
    <div>
      <h4 className={`text-base font-bold mb-1 font-playfair ${isDark ? 'text-white' : 'text-slate-900'}`}>
        {rule.title}
      </h4>
      <p className={`text-sm leading-relaxed font-inter ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
        {rule.description}
      </p>
    </div>
  </div>
);

// ==================================================================================
// FUNÇÕES DE UTILIDADE
// ==================================================================================
const sanitizeInput = (value: string): string => {
  return value.replace(/[<>&"']/g, '');
};

const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
};

const validatePhone = (phone: string): boolean => {
  const re = /^\+?[1-9]\d{1,14}$/;
  return re.test(phone.replace(/\D/g, ''));
};

const validateAddress = (address: Address): boolean => {
  if (address.street && address.number && address.district && address.city) {
    return true;
  }
  return false;
};

const cleanupStorage = () => {
  try {
    const itemsToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('@thaly_app')) {
        const item = localStorage.getItem(key);
        if (item) {
          try {
            const parsed = JSON.parse(item);
            if (parsed.expires && new Date(parsed.expires) < new Date()) {
              itemsToRemove.push(key);
            }
          } catch (e) {
            itemsToRemove.push(key);
          }
        }
      }
    }
    itemsToRemove.forEach(key => localStorage.removeItem(key));
  } catch (e) {
    console.error('Storage cleanup error:', e);
  }
};

// ==================================================================================
// GERAÇÃO DE DADOS
// ==================================================================================
const generateReviews = (isPT: boolean): Review[] => {
  const reviews = [
    { n: "Bruno", loc: "SP - Bela Vista", t: "Thalyson, quero dizer que sua massagem foi muito bem executada. Recomendo muito." },
    { n: "Tiago", loc: "SP - Bela Vista", t: "O Thalyson tem uma energia surreal. A massagem foi perfeita, melhor da minha vida." },
    { n: "Alan", loc: "SP - Bela Vista", t: "Gostei bastante, saí mais leve. Da pra ver que ele manda bem no que faz." },
    { n: "Marcos", loc: "Londrina", t: "Foi incrível, recomendo demais." },
    { n: "Giovana", loc: "Hotel Portal da Mata, Santa Fé", t: "Você tem mãos abençoadas e eu voeeei! Precisava muito desse descanso, dessa paz. Foi super respeitoso a todo tempo e me relaxou demais. Obrigada! ❤️" },
    { n: "Lucas", loc: "Rio Preto", t: "Curti o sigilo e o local ser no meu hotel. Muito prático." },
    { n: "Felipe", loc: "Santa Fé", t: "Nunca tinha feito tântrica. Foi uma descoberta, recomendo." },
    { n: "André", loc: "Jales", t: "Massagem completa de verdade. O corpo todo agradece." },
    { n: "Rafa", loc: "SP - Centro", t: "O final foi explosivo. Voltarei em breve." },
    { n: "Gustavo", loc: "Londrina", t: "Cheiro bom, música boa e mão de anjo." },
    { n: "Pedro", loc: "Rio Preto", t: "Profissional, educado e gato. Combo perfeito." },
    { n: "João", loc: "Jales", t: "A troca foi intensa. Senti cada toque." },
    { n: "Matheus", loc: "SP - Jardins", t: "Relaxei tanto que quase dormi." },
    { n: "Daniel", loc: "Santa Fé", t: "Muito atencioso com o que eu pedi. Nota 10." },
    { n: "Eduardo", loc: "Londrina", t: "Serviço de primeira. Vale cada centavo." },
    { n: "Vitor", loc: "Rio Preto", t: "Me deixou super a vontade." },
    { n: "Caio", loc: "SP - Augusta", t: "Curti a vibe do cara. Muito gente boa." },
    { n: "Renan", loc: "Votuporanga", t: "Massagem forte na medida certa." },
    { n: "Diego", loc: "Fernandópolis", t: "Saí renovado. O estresse foi embora." },
    { n: "Gabriel", loc: "SP - Paulista", t: "Excelente. Não vejo a hora de repetir." },
    { n: "Leo", loc: "Rio Preto", t: "Mão quente e pegada firme." },
    { n: "Ricardo", loc: "Jales", t: "Top demais. Super indico." },
    { n: "Marcelo", loc: "Londrina", t: "Atendimento impecável do começo ao fim." },
    { n: "Fernando", loc: "Santa Fé", t: "Uma experiência que todo homem deveria ter." },
    { n: "Igor", loc: "SP - Consolação", t: "Discreto e pontual. Gostei." },
    { n: "Paulo", loc: "Rio Preto", t: "Sensação única de liberdade." }
  ];
  return reviews.map(r => ({ ...r, s: 5 }));
};

const getData = (lang: string) => {
  const isPT = lang === 'pt';
  const currency = isPT ? 'R$' : '$';
  const p = {
    relax: isPT ? 125 : 25,
    sens: isPT ? 155 : 30,
    titan: isPT ? 195 : 40,
    packRelax: { v: isPT ? 390 : 80, full: isPT ? 500 : 100, save: isPT ? 110 : 20 },
    packTri: { v: isPT ? 480 : 95, full: isPT ? 585 : 120, save: isPT ? 105 : 25 },
    packMix: { v: isPT ? 600 : 130, full: isPT ? 700 : 140, save: isPT ? 100 : 10 }
  };
  
  const rules: Rule[] = isPT ? [
    {
      icon: "shower",
      title: "Higiene",
      description: "Tome um banho antes da sessão para garantir o máximo de conforto e bem-estar para ambos."
    },
    {
      icon: "hand",
      title: "Respeito",
      description: "Não insista em algo que não está no menu. Respeito é essencial para uma experiência positiva."
    },
    {
      icon: "banknote",
      title: "Pagamento",
      description: "Pode ser realizado antes ou após o serviço, conforme sua preferência e combinação prévia."
    },
    {
      icon: "clock",
      title: "Cancelamento",
      description: "Avise com pelo menos 2h de antecedência para remarcar sem custos adicionais."
    },
    {
      icon: "user-check",
      title: "Pontualidade",
      description: "Chegarei no horário combinado. Peço a mesma consideração caso você precise remarcar."
    },
    {
      icon: "shield",
      title: "Sigilo",
      description: "Total discrição e profissionalismo. Sua privacidade é minha prioridade absoluta."
    }
  ] : [
    {
      icon: "shower",
      title: "Hygiene",
      description: "Please take a shower before the session to ensure maximum comfort and well-being for both."
    },
    {
      icon: "hand",
      title: "Respect",
      description: "Do not insist on anything not on the menu. Respect is essential for a positive experience."
    },
    {
      icon: "banknote",
      title: "Payment",
      description: "Can be made before or after the service, according to your preference and prior arrangement."
    },
    {
      icon: "clock",
      title: "Cancellation",
      description: "Please notify at least 2h in advance to reschedule without additional costs."
    },
    {
      icon: "user-check",
      title: "Punctuality",
      description: "I will arrive at the agreed time. I ask for the same consideration if you need to reschedule."
    },
    {
      icon: "shield",
      title: "Privacy",
      description: "Total discretion and professionalism. Your privacy is my absolute priority."
    }
  ];
  
  return {
    levels: [
      { level: 1, xpNeeded: 0, reward: 0, title: isPT ? "Visitante" : "Visitor" },
      { level: 2, xpNeeded: 100, reward: 15, title: isPT ? "Conhecido" : "Acquaintance" },
      { level: 3, xpNeeded: 350, reward: 30, title: isPT ? "Próximo" : "Closer" },
      { level: 4, xpNeeded: 800, reward: 50, title: isPT ? "Íntimo" : "Intimate" }
    ],
    services: [
      {
        id: 'relaxante',
        min: 60,
        price: p.relax,
        icon: "user-check",
        tag: isPT ? "100% FÍSICO" : "PHYSICAL",
        title: isPT ? "Massagem Clássica" : "Classic Relax",
        desc: isPT ? "Corpo todo (Costas, Mãos e Pés). Pressão Baixa/Média para relaxar." : "Full body. Low/Mid pressure to relax.",
        details: isPT
          ? `Foco: Costas, pernas, mãos e pés
Pressão: Baixa a média
Objetivo: Tirar o cansaço do dia
Sem toque íntimo nesta modalidade`
          : `Focus: Back, legs, hands, feet
Pressure: Low to Medium
Goal: Daily stress relief
No intimate touch`
      },
      {
        id: 'sensitiva',
        min: 60,
        price: p.sens,
        icon: "sparkles",
        tag: isPT ? "SENSORIAL + LINGAM" : "SENSORY + LINGAM",
        title: isPT ? "Tântrica Sensorial" : "Tantric Sensory",
        desc: isPT ? "Toque sutil, arrepios pelo corpo e finalização (Lingam)." : "Subtle touch, shivers and Lingam finish.",
        details: isPT
          ? `Toques sutis pelo corpo todo
Objetivo: Arrepios e sensibilidade
Finaliza com Massagem Lingam
Você recebe e sente`
          : `Subtle touches all over
Goal: Shivers and sensitivity
Ends with Lingam Massage
You receive and feel`
      },
      {
        id: 'mista',
        min: 60,
        price: p.titan,
        icon: "flame",
        tag: isPT ? "A MAIS COMPLETA" : "FULL FUSION",
        title: isPT ? "Experiência Fusion" : "Fusion Experience",
        desc: isPT ? "Massagem relaxante + Corpo a Corpo + Lingam." : "Relaxing + Body-to-Body + Lingam.",
        details: isPT
          ? `Começamos soltando a musculatura
Corpo a Corpo (troca de energia)
Finalização Lingam intensa
A experiência definitiva`
          : `Relaxing muscle start
Body-to-Body energy
Intense Lingam finish
The definitive experience`
      }
    ] as ServiceItem[],
    extras: [
  {
    id: 'more_time',
    price: isPT ? 55 : 15,
    icon: "watch",
    label: isPT ? "+30 Minutos" : "+30 Minutes",
    desc: isPT ? "Estender a sessão" : "Extend session"
  },
  {
    id: 'touch',
    price: isPT ? 55 : 15,
    icon: "hand",
    label: isPT ? "Troca Interativa" : "Interactive Touch",
    desc: isPT ? "Você pode tocar" : "You can touch"
  },
  {
    id: 'aroma',
    price: isPT ? 5 : 5,
    icon: "flower",
    label: isPT ? "Aromaterapia" : "Aromatherapy",
    desc: isPT ? "Cheiro bom no ambiente" : "Good scent in the environment"
  },
  {
    id: 'hair_trim',
    price: isPT ? 66 : 15,
    icon: "scissors",
    label: isPT ? "Aparador de Pêlos" : "Hair Trimmer",
    desc: isPT ? "Aparador com maquininha até 2 locais" : "Hair trimmer for up to 2 areas"
  },
  {
    id: 'pain_relief',
    price: isPT ? 35 : 8,
    icon: "pill",
    label: isPT ? "Pomada para Dores" : "Pain Relief Cream",
    desc: isPT ? "Alivia as dores no corpo durante a sessão" : "Relieves body pain during session"
  }
] as any[],
    plans: [
      {
        id: 'pack_relax',
        type: 'pack',
        title: isPT ? "Ciclo Anti-Stress" : "Anti-Stress Cycle",
        price: p.packRelax.v,
        fullPrice: p.packRelax.full,
        savings: p.packRelax.save,
        desc: isPT ? "4 Sessões Relaxantes" : "4 Relax Sessions",
        details: isPT ? "4 sessões de Massagem Relaxante\nIdeal para usar 1x por semana\nManutenção corporal regular" : "4 Relaxing sessions\nIdeal for once a week\nRegular body maintenance",
        tag: isPT ? "BÁSICO" : "BASIC",
        icon: "package"
      },
      {
        id: 'pack_mista',
        type: 'pack',
        title: isPT ? "Trilogia Fusion" : "Fusion Trilogy",
        price: p.packTri.v,
        fullPrice: p.packTri.full,
        savings: p.packTri.save,
        desc: isPT ? "3 Sessões Fusion" : "3 Fusion Sessions",
        details: isPT ? "3 encontros da massagem completa\nGaranta sua satisfação\nExperiência premium total" : "3 full massage meetings\nSatisfaction guaranteed\nTotal premium experience",
        tag: isPT ? "MAIS VENDIDO" : "BEST SELLER",
        icon: "layers"
      },
      {
        id: 'pack_mix_4',
        type: 'pack',
        title: isPT ? "Ciclo Misto" : "Mixed Cycle",
        price: p.packMix.v,
        fullPrice: p.packMix.full,
        savings: p.packMix.save,
        desc: isPT ? "2 Sensoriais + 2 Fusion" : "2 Sensory + 2 Fusion",
        details: isPT ? "2 Sessões Tântrica Sensorial\n2 Sessões Experiência Fusion\nIdeal para intercalar semanalmente" : "2 Sensory Sessions\n2 Fusion Sessions\nIdeal for weekly alternating",
        tag: isPT ? "EXPERIÊNCIA TOTAL" : "FULL EXPERIENCE",
        icon: "star"
      }
    ] as ServiceItem[],
    faq: [
      {
        q: isPT ? "Como agendar?" : "How to book?",
        a: isPT ? "Escolha a sessão aqui no app e finalize no WhatsApp para confirmar data e horário." : "Choose session here and finalize on WhatsApp."
      },
      {
        q: isPT ? "Aceita cartão?" : "Accept cards?",
        a: isPT ? "Sim. Aceito Pix (3% desconto), Dinheiro e Cartão de Crédito." : "Yes. Pix (3% OFF), Cash and Credit Card."
      },
      {
        q: isPT ? "Tem local?" : "Do you have a place?",
        a: isPT ? "Atendo em hotéis e a domicílio. Não tenho espaço fixo no momento." : "I attend at hotels and homes."
      },
      {
        q: isPT ? "É sigiloso?" : "Is it discreet?",
        a: isPT ? "Totalmente. Chego como visitante comum, sem uniformes ou identificação." : "Totally. I arrive as a regular visitor."
      }
    ],
    reviews: generateReviews(isPT),
    rules,
    currency,
    text: {
      welcome: isPT ? "Olá," : "Hello,",
      choose_sub: isPT ? "Escolha seu momento de relaxamento" : "Choose your relaxation moment",
      level_label: isPT ? "Nível Fidelidade" : "Loyalty Level",
      tab_packs: isPT ? "Pacotes" : "Packages",
      tab_single: isPT ? "Sessão Avulsa" : "Single Session",
      book_btn: isPT ? "Agendar" : "Book Now",
      next_btn: isPT ? "Próximo" : "Next",
      finish_btn: isPT ? "Finalizar" : "Finish",
      loading: isPT ? "Carregando..." : "Loading...",
      toast_select_item: isPT ? "Selecione um serviço" : "Select a service",
      toast_select_date: isPT ? "Escolha data e hora" : "Select date and time",
      toast_fill_name: isPT ? "Preencha seu nome" : "Fill your name",
      toast_fill_addr: isPT ? "Preencha o endereço completo" : "Fill complete address",
      toast_fill_hotel: isPT ? "Preencha dados do hotel" : "Fill hotel details",
      toast_select_pay: isPT ? "Selecione forma de pagamento" : "Select payment method",
      toast_accept_terms: isPT ? "Aceite as regras" : "Accept terms",
      toast_coupon_success: isPT ? "Cupom aplicado!" : "Coupon applied!",
      details_label: isPT ? "Detalhes" : "Details",
      select_time_title: isPT ? "Data e Hora" : "Date & Time",
      location_title: isPT ? "Local do Atendimento" : "Service Location",
      extras_title: isPT ? "Turbine sua sessão:" : "Boost your session:",
      coupon_section: isPT ? "Seus Cupons" : "Your Coupons",
      no_coupons: isPT ? "Nenhum cupom disponível" : "No coupons available",
      payment_title: isPT ? "Forma de Pagamento" : "Payment Method",
      terms_title: isPT ? "Regras de Atendimento" : "Service Rules",
      success_title: isPT ? "Pré-Agendamento Feito!" : "Pre-Booking Done!",
      success_sub: isPT ? "Envie o resumo no WhatsApp para confirmar" : "Send summary on WhatsApp to confirm",
      whatsapp_btn: isPT ? "Finalizar no WhatsApp" : "Finalize on WhatsApp",
      back_home: isPT ? "Voltar ao Início" : "Back Home",
      timer_text: isPT ? "Segurando vaga" : "Holding spot",
      motel_note: isPT ? "Em motéis, o valor da suíte é pago por você diretamente ao local." : "In motels, suite fee is paid by you.",
      upgrade_msg: isPT ? "💡 Dica: A Massagem Relaxante NÃO inclui toque íntimo. Por apenas +R$30, você leva a Tântrica completa." : "💡 Tip: Relax Massage does NOT include intimate touch.",
      input_name: isPT ? "Como devo te chamar?" : "Your name",
      input_addr: isPT ? "Endereço (Rua)" : "Address (Street)",
      input_num: isPT ? "Número" : "Number",
      input_district: isPT ? "Bairro" : "District",
      input_city: isPT ? "Cidade" : "City",
      input_comp: isPT ? "Complemento" : "Unit/Apt",
      input_hotel: isPT ? "Nome do Hotel" : "Hotel Name",
      input_room: isPT ? "Número do Quarto" : "Room Number",
      agree_terms: isPT ? "Li e concordo com as regras" : "I agree to terms",
      install_app: isPT ? "Instalar App" : "Install App",
      install_desc: isPT ? "Adicione à tela inicial para acesso rápido" : "Add to home screen for quick access",
      faq_title: isPT ? "Perguntas Frequentes" : "FAQ",
      reviews_title: isPT ? "O que dizem sobre as sessões" : "What they say about sessions",
      empty_date: isPT ? "Selecione uma data acima" : "Select a date above",
      empty_slots: isPT ? "Sem horários para este dia" : "No slots for this day",
      total_label: isPT ? "Total" : "Total",
      subtotal: isPT ? "Subtotal" : "Subtotal",
      discount: isPT ? "Desconto" : "Discount",
      pix_discount: isPT ? "Desconto Pix (3%)" : "Pix Discount (3%)",
      welcome_popup_title: isPT ? "Bem-vindo!" : "Welcome!",
      welcome_popup_msg: isPT ? "Para começar nossa conexão, aqui está um presente especial." : "To start our connection, here's a special gift.",
      levelup_popup_title: isPT ? "Subiu de Nível!" : "Level Up!",
      levelup_popup_msg: isPT ? "Você está mais próximo. Aproveite seu prêmio." : "You're closer now. Enjoy your reward.",
      get_coupon: isPT ? "Pegar Cupom" : "Get Coupon",
      rules_complete: isPT ? "Regras Completas de Atendimento" : "Complete Service Rules"
    }
  };
};

// ==================================================================================
// MAIN APP
// ==================================================================================
export default function App() {
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [step, setStep] = useState(0);
  const [lang, setLang] = useState('pt');
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState('packs');
  const [toasts, setToasts] = useState<{id: number, msg: string, type: "success" | "error"}[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [welcomePopup, setWelcomePopup] = useState(false);
  const [levelUpPopup, setLevelUpPopup] = useState(false);
  
  const DATA = useMemo(() => getData(lang), [lang]);
  const T = DATA.text;
  
  const [user, setUser] = useState<UserData>({
    name: '',
    xp: 0,
    coupons: [],
    usedCoupons: [],
    hasSeenWelcome: false,
    ordersCount: 69,
    lastActivity: new Date().toISOString()
  });
  
  const [booking, setBooking] = useState<BookingData>({
    type: 'single',
    item: null,
    extras: {},
    date: null,
    time: null,
    locationType: 'home',
    address: {
      street: '',
      number: '',
      district: '',
      city: '',
      comp: '',
      placeName: ''
    },
    payment: '',
    appliedCoupon: null,
    termsAccepted: false,
    bookingId: `BOOK_${Date.now()}`
  });
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const dateScrollRef = useRef<HTMLDivElement>(null);
  
  // Initialize
  useEffect(() => {
    setIsClient(true);
    cleanupStorage();
  }, []);
  
  // Load from storage with error handling and validation
  useEffect(() => {
    if (!isClient) return;
    
    try {
      const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          
          if (parsed.user && typeof parsed.user === 'object') {
            const validatedUser = {
              name: parsed.user.name || '',
              xp: typeof parsed.user.xp === 'number' ? parsed.user.xp : 0,
              coupons: Array.isArray(parsed.user.coupons) ? parsed.user.coupons : [],
              usedCoupons: Array.isArray(parsed.user.usedCoupons) ? parsed.user.usedCoupons : [],
              hasSeenWelcome: typeof parsed.user.hasSeenWelcome === 'boolean' ? parsed.user.hasSeenWelcome : false,
              ordersCount: typeof parsed.user.ordersCount === 'number' ? Math.max(parsed.user.ordersCount, 69) : 69,
              lastActivity: parsed.user.lastActivity || new Date().toISOString()
            };
            setUser(validatedUser);
          }
          
          if (parsed.bookingDraft && typeof parsed.bookingDraft === 'object') {
            const draftDate = new Date(parsed.bookingDraft.date);
            if (draftDate > new Date()) {
              const sanitizedBooking = {
                ...parsed.bookingDraft,
                address: {
                  street: sanitizeInput(parsed.bookingDraft.address?.street || ''),
                  number: sanitizeInput(parsed.bookingDraft.address?.number || ''),
                  district: sanitizeInput(parsed.bookingDraft.address?.district || ''),
                  city: sanitizeInput(parsed.bookingDraft.address?.city || ''),
                  comp: sanitizeInput(parsed.bookingDraft.address?.comp || ''),
                  placeName: sanitizeInput(parsed.bookingDraft.address?.placeName || '')
                }
              };
              setBooking(sanitizedBooking);
            }
          }
          
          if (typeof parsed.step === 'number' && parsed.step >= 0 && parsed.step <= 4) {
            setStep(parsed.step);
          }
        } catch (e) {
          console.error('Error parsing stored data:', e);
          localStorage.removeItem(CONFIG.STORAGE_KEY);
        }
      }
    } catch (e) {
      console.error('Storage access error:', e);
      localStorage.removeItem(CONFIG.STORAGE_KEY);
    }
    
    setDataLoaded(true);
    setTimeout(() => setLoading(false), 1200);
  }, [isClient]);
  
  useEffect(() => {
    if (isClient && dataLoaded) {
      try {
        const saveData = {
          user: {
            ...user,
            lastActivity: new Date().toISOString()
          },
          bookingDraft: {
            ...booking,
            appliedCoupon: booking.appliedCoupon ? {
              id: booking.appliedCoupon.id,
              val: booking.appliedCoupon.val,
              title: booking.appliedCoupon.title,
              code: booking.appliedCoupon.code
            } : null
          },
          step,
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        };
        
        const serialized = JSON.stringify(saveData);
        const size = serialized.length / 1024;
        
        if (size > 100) {
          console.warn('Storage data too large:', size, 'KB');
          return;
        }
        
        localStorage.setItem(CONFIG.STORAGE_KEY, serialized);
        cleanupStorage();
      } catch (e) {
        console.error('Storage error:', e);
      }
    }
  }, [user, booking, step, isClient, dataLoaded]);
  
  useEffect(() => {
    if (!loading && isClient && dataLoaded && !user.hasSeenWelcome && !welcomePopup) {
      const timer = setTimeout(() => setWelcomePopup(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [loading, isClient, user.hasSeenWelcome, dataLoaded, welcomePopup]);
  
  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [step]);
  
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CONFIG.STORAGE_KEY && e.oldValue && !e.newValue) {
        console.warn('Storage was unexpectedly cleared');
        setUser({
          name: '',
          xp: 0,
          coupons: [],
          usedCoupons: [],
          hasSeenWelcome: false,
          ordersCount: 69,
          lastActivity: new Date().toISOString()
        });
        setBooking({
          type: 'single',
          item: null,
          extras: {},
          date: null,
          time: null,
          locationType: 'home',
          address: {
            street: '',
            number: '',
            district: '',
            city: '',
            comp: '',
            placeName: ''
          },
          payment: '',
          appliedCoupon: null,
          termsAccepted: false,
          bookingId: `BOOK_${Date.now()}`
        });
        setStep(0);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  const addToast = (msg: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'Thalyson Massagens', url: window.location.href })
        .catch(e => {
          if (e.name !== 'AbortError') {
            console.error('Share failed:', e);
            addToast("Erro ao compartilhar", "error");
          }
        });
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => addToast("Link copiado!", "success"))
        .catch(e => {
          console.error('Copy failed:', e);
          addToast("Erro ao copiar link", "error");
        });
    }
  };
  
  const handleSelectItem = (type: 'single' | 'pack', item: ServiceItem) => {
    setBooking(prev => ({ 
      ...prev, 
      type, 
      item, 
      extras: {}, 
      payment: '', 
      termsAccepted: false,
      bookingId: `BOOK_${Date.now()}`
    }));
    
    if (item.id === 'relaxante') {
      addToast(T.upgrade_msg, "error");
    } else {
      addToast(item.title, "success");
    }
  };
  
  const daysArray = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push(d);
    }
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
    if (!booking.item) return { total: 0, sub: 0, disc: 0, pixDisc: 0 };
    
    let sub = booking.item.price;
    Object.keys(booking.extras).forEach(k => {
      if (booking.extras[k]) {
        const extData = DATA.extras.find(e => e.id === k);
        if (extData) {
          const extraPrice = booking.type !== 'single' ? Math.floor(extData.price * 0.8) : extData.price;
          sub += extraPrice;
        }
      }
    });
    
    const disc = booking.appliedCoupon ? booking.appliedCoupon.val : 0;
    let totalAfterCoupon = Math.max(0, sub - disc);
    let pixDisc = 0;
    
    if (booking.payment === 'pix') {
      pixDisc = Math.ceil(totalAfterCoupon * 0.03);
    }
    
    const finalTotal = Math.max(0, totalAfterCoupon - pixDisc);
    return { sub, disc, pixDisc, total: finalTotal };
  }, [booking.item, booking.extras, booking.appliedCoupon, booking.type, DATA.extras, booking.payment]);
  
  const estimatedXP = useMemo(() => {
    const baseXP = financials.total;
    const isPack = booking.type === 'pack';
    const percentage = isPack ? 0.30 : 0.15;
    return Math.floor(baseXP * percentage);
  }, [financials.total, booking.type]);
  
  const getNextLevelInfo = (currentXP: number) => {
    if (currentXP >= 800) {
      const cycleXP = currentXP - 800;
      const nextRewardAt = 500 - (cycleXP % 500);
      return { needed: nextRewardAt, reward: 50, title: "Íntimo Plus" };
    }
    
    const nextLevel = DATA.levels.find(l => l.xpNeeded > currentXP);
    return nextLevel ? { needed: nextLevel.xpNeeded - currentXP, reward: nextLevel.reward, title: nextLevel.title } : null;
  };
  
  const getCurrentLevelProgress = () => {
    if (user.xp >= 800) {
      return ((user.xp - 800) % 500 / 500) * 100;
    }
    
    const currentLevelIndex = DATA.levels.slice().reverse().findIndex(l => user.xp >= l.xpNeeded);
    const realIndex = currentLevelIndex === -1 ? 0 : DATA.levels.length - 1 - currentLevelIndex;
    const currentLevel = DATA.levels[realIndex];
    const nextLevel = DATA.levels[realIndex + 1];
    
    if (!nextLevel) return 100;
    return Math.min(100, Math.max(0, ((user.xp - currentLevel.xpNeeded) / (nextLevel.xpNeeded - currentLevel.xpNeeded)) * 100));
  };
  
  const generateSecurityHash = (price: number, date: string, itemName: string) => {
    const raw = `${price}-${date}-${itemName}-${CONFIG.SECRET_TOKEN}`;
    return btoa(raw).substring(0, 8).toUpperCase();
  };
  
  const generateWhatsAppLink = () => {
    const f = financials;
    const dateStr = booking.date ? new Date(booking.date).toLocaleDateString(lang === 'pt' ? CONFIG.LOCALE_PT : CONFIG.LOCALE_EN) : '';
    const securityHash = generateSecurityHash(f.total, dateStr, booking.item?.id || '');
    const greeting = lang === 'pt' ? "Olá! Gostaria de agendar:" : "Hello! I'd like to book:";
    
    let serviceTitle = booking.item?.title || '';
    if (booking.type !== 'single' && booking.item?.desc) {
      const descClean = booking.item.desc.replace(/^(Contém:|Contains:)\s*/i, '');
      serviceTitle += `\n📦 ${lang === 'pt' ? 'Inclui' : 'Includes'}: ${descClean}`;
    }
    
    let locTxt = "";
    let mapQuery = "";
    
    if (booking.locationType === 'home') {
      const fullAddr = `${booking.address.street}, ${booking.address.number} - ${booking.address.district}, ${booking.address.city}`;
      locTxt = `Residência\n📍 ${fullAddr}\n📝 Comp: ${booking.address.comp || '-'}`;
      mapQuery = fullAddr;
    } else if (booking.locationType === 'motel') {
      locTxt = `Motel\n⚠️ (${lang === 'pt' ? 'Local por conta do cliente' : 'Venue fee on client'})`;
    } else {
      const fullAddr = `${booking.address.placeName}, ${booking.address.city}`;
      locTxt = `Hotel: ${booking.address.placeName}\n📍 ${booking.address.city}\n🚪 ${lang === 'pt' ? 'Quarto' : 'Room'}: ${booking.address.comp || '-'}`;
      mapQuery = fullAddr;
    }
    
    const extrasList = Object.keys(booking.extras).filter(k => booking.extras[k]).map(k => {
      const ex = DATA.extras.find(e => e.id === k);
      if (!ex) return '';
      const price = booking.type !== 'single' ? Math.floor(ex.price * 0.8) : ex.price;
      return `✅ ${ex.label} (+ ${DATA.currency} ${price})`;
    }).filter(Boolean).join('\n');
    
    let priceDisplay = `💵 Preço Base: ${DATA.currency} ${f.sub}`;
    if (f.disc > 0) priceDisplay += `\n📉 Desconto Cupom: -${DATA.currency} ${f.disc}`;
    if (f.pixDisc > 0) priceDisplay += `\n📉 Desconto Pix (3%): -${DATA.currency} ${f.pixDisc}`;
    priceDisplay += `\n💰 TOTAL: ${DATA.currency} ${f.total},00`;
    
    const msg = `
${greeting}
🔥 NOVO PEDIDO #${securityHash}
──────────────────────
👤 Cliente: ${sanitizeInput(user.name)}
💆‍♂️ Sessão: ${serviceTitle}
📅 Quando: ${dateStr} - ${booking.time}
${extrasList ? `➕ Adicionais:\n${extrasList}\n` : ''}
📍 Local:\n${locTxt}
${mapQuery ? `\n🔗 Mapa: https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}` : ''}
──────────────────────
💲 Valor:\n${priceDisplay}
💳 Pagamento: ${booking.payment.toUpperCase()}
🚗 Uber: Calcular Ida/Volta
📸 Instagram: ${CONFIG.INSTAGRAM_URL}
Aguardo confirmação, obrigado!
    `.trim();
    
    return `https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`;
  };
  
  const validateStep = () => {
    if (step === 0 && !booking.item) {
      addToast(T.toast_select_item, "error");
      return false;
    }
    
    if (step === 1 && (!booking.date || !booking.time)) {
      addToast(T.toast_select_date, "error");
      return false;
    }
    
    if (step === 2) {
      if (!user.name || user.name.trim().length < 3) {
        addToast(T.toast_fill_name, "error");
        return false;
      }
      
      if (booking.locationType === 'home') {
        if (!validateAddress(booking.address)) {
          addToast(T.toast_fill_addr, "error");
          return false;
        }
      }
      
      if (booking.locationType === 'hotel') {
        if (!booking.address.placeName || !booking.address.city) {
          addToast(T.toast_fill_hotel, "error");
          return false;
        }
      }
      
      return true;
    }
    
    if (step === 3) {
      if (!booking.payment) {
        addToast(T.toast_select_pay, "error");
        return false;
      }
      
      if (!booking.termsAccepted) {
        addToast(T.toast_accept_terms, "error");
        return false;
      }
      
      return true;
    }
    
    return true;
  };
  
  const finishBooking = () => {
    let updatedCoupons = [...user.coupons];
    let updatedHistory = [...user.usedCoupons];
    
    if (booking.appliedCoupon) {
      if (!updatedHistory.includes(booking.appliedCoupon.code)) {
        updatedHistory.push(booking.appliedCoupon.code);
      }
      updatedCoupons = updatedCoupons.filter(c => c.code !== booking.appliedCoupon?.code);
    }
    
    const newXP = user.xp + estimatedXP;
    let leveledUp = false;
    let newLevelTitle = "";
    
    DATA.levels.forEach(lvl => {
      if (newXP >= lvl.xpNeeded && user.xp < lvl.xpNeeded && lvl.level > 1) {
        leveledUp = true;
        newLevelTitle = lvl.title;
        updatedCoupons.push({
          id: `LVL${lvl.level}_${Date.now()}`,
          val: lvl.reward,
          title: `🏆 ${lvl.title}`,
          code: `LVLUP${lvl.level}`
        });
      }
    });
    
    const newOrdersCount = (user.ordersCount || 69) + 1;
    
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
      setTimeout(() => {
        addToast(`${T.levelup_popup_title} ${newLevelTitle}!`, "success");
      }, 500);
    }
    
    window.open(generateWhatsAppLink(), '_blank');
    
    setBooking({
      type: 'single',
      item: null,
      extras: {},
      date: null,
      time: null,
      locationType: 'home',
      address: { street: '', number: '', district: '', city: '', comp: '', placeName: '' },
      payment: '',
      appliedCoupon: null,
      termsAccepted: false,
      bookingId: `BOOK_${Date.now()}`
    });
    
    setStep(4);
  };
  
  const handleNextStep = () => {
    if (validateStep()) {
      if (step === 3) {
        finishBooking();
      } else {
        setStep(s => s + 1);
      }
    }
  };
  
  const scrollDates = (dir: 'left' | 'right') => {
    if (dateScrollRef.current) {
      const amt = dir === 'left' ? -200 : 200;
      dateScrollRef.current.scrollBy({ left: amt, behavior: 'smooth' });
    }
  };
  
  const nextLevelInfo = getNextLevelInfo(user.xp);
  
  if (!isClient) {
    return <div className="min-h-screen w-full bg-zinc-950" />;
  }
  
  if (loading) {
    return (
      <div className={`fixed inset-0 flex flex-col items-center justify-center z-[100] ${isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className="flex flex-col items-center max-w-xs w-full px-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-blue-400 text-white flex items-center justify-center text-4xl font-bold mb-8 shadow-2xl animate-pulse">
            T
          </div>
          <div className="w-full h-1.5 bg-zinc-800/20 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-blue-500"
              style={{ width: '100%', animation: 'loading-bar 2s infinite' }}
            ></div>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">
            {T.loading}
          </p>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes loading-bar {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}} />
      </div>
    );
  }
  
  return (
    <>
      <GlobalStyles />
      
      <div className={`fixed inset-0 z-0 ${isDark ? 'bg-zinc-950' : 'bg-white'}`} />

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className={`absolute top-0 left-0 w-96 h-96 blur-3xl rounded-full opacity-20 ${isDark ? 'bg-blue-600' : 'bg-blue-400'}`} />
        <div className={`absolute bottom-0 right-0 w-96 h-96 blur-3xl rounded-full opacity-20 ${isDark ? 'bg-indigo-600' : 'bg-indigo-400'}`} />
      </div>
      
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none px-4 w-full max-w-md">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`
              pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-lg animate-in slide-in-from-top font-inter
              ${t.type === 'success'
                ? isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-100 border-emerald-200 text-emerald-800'
                : isDark ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-amber-100 border-amber-200 text-amber-700'
              }
            `}
          >
            <Icon name={t.type === 'success' ? 'check' : 'alert-circle'} size={20} />
            <span className="text-sm font-medium">{t.msg}</span>
          </div>
        ))}
      </div>
      
      {step !== 4 && (
        <header className="pt-12 pb-6 px-6 md:px-12 flex items-start justify-between relative z-20 max-w-6xl mx-auto">
          <div className="flex flex-col">
            <h1 className={`text-2xl font-bold tracking-tight font-playfair leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Thalyson <br className="block md:hidden" /> Massagens
            </h1>
            <div className="flex items-center gap-2 text-[10px] text-blue-500 font-black uppercase tracking-widest mt-2 font-inter">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              {user.ordersCount || 69} Sessões Realizadas
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-2 max-w-[180px]">
            <button
              onClick={() => setSettingsOpen(true)}
              className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${isDark ? 'bg-zinc-900 text-zinc-400 hover:text-white' : 'bg-white text-slate-500 hover:text-slate-900 shadow-sm'}`}
              aria-label="Configurações"
            >
              <Icon name="settings" size={18} />
            </button>
            <button
              onClick={handleShare}
              className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${isDark ? 'bg-zinc-900 text-zinc-400 hover:text-white' : 'bg-white text-slate-500 hover:text-slate-900 shadow-sm'}`}
              aria-label="Compartilhar"
            >
              <Icon name="share" size={18} />
            </button>
            <button
              onClick={() => setLang(l => l === 'pt' ? 'en' : 'pt')}
              className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${isDark ? 'bg-zinc-900 text-zinc-400 hover:text-white' : 'bg-white text-slate-500 hover:text-slate-900 shadow-sm'}`}
              aria-label="Alterar idioma"
            >
              <Icon name="globe" size={18} />
            </button>
            <button
              onClick={() => setIsDark(!isDark)}
              className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${isDark ? 'bg-zinc-900 text-zinc-400 hover:text-white' : 'bg-white text-blue-500 shadow-sm'}`}
              aria-label="Alternar tema"
            >
              <Icon name={isDark ? 'moon' : 'sun'} size={18} />
            </button>
          </div>
        </header>
      )}
      
      <main ref={scrollRef} className={`overflow-y-auto pb-32 px-6 md:px-12 relative z-10 min-h-screen ${isDark ? 'text-white' : 'text-black'}`}>
        <div className="max-w-6xl mx-auto space-y-12">
          {step === 0 && (
            <div className="space-y-12 animate-in fade-in duration-700">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-8">
                <div>
                  <h2 className={`text-4xl md:text-5xl font-playfair font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {T.welcome} <span className="text-blue-500">{user.name ? user.name.split(' ')[0] : (lang === 'pt' ? "Visitante" : "Visitor")}</span>
                  </h2>
                  <p className={`text-lg mb-8 font-inter ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                    {T.choose_sub}
                  </p>
                </div>
                
                <div className={`p-8 rounded-3xl border ${isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-slate-200 shadow-xl'}`}>
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isDark ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                        <Icon name="award" size={28} />
                      </div>
                      <div>
                        <span className={`text-xs uppercase font-bold tracking-wider font-inter ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                          {T.level_label}
                        </span>
                        <h3 className={`text-2xl font-bold mt-1 font-playfair ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {user.xp >= 800 ? "Íntimo Plus" : (DATA.levels.find(l => user.xp >= l.xpNeeded && (!DATA.levels.find(nl => nl.xpNeeded > l.xpNeeded && user.xp >= nl.xpNeeded)))?.title || DATA.levels[0].title)}
                        </h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-4xl font-bold font-playfair ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.xp}</span>
                      <span className="text-xs font-bold text-blue-500 block font-inter">XP</span>
                    </div>
                  </div>
                  <div>
                    <div className={`flex justify-between text-xs font-semibold mb-2 font-inter ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                      <span>Progresso</span>
                      <span className="text-blue-500">{Math.floor(getCurrentLevelProgress())}%</span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-slate-300'}`}>
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
                        style={{ width: `${getCurrentLevelProgress()}%`, transition: 'width 1s ease' }}
                      />
                    </div>
                    {nextLevelInfo && (
                      <p className={`text-xs mt-3 text-center font-inter ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                        Faltam {nextLevelInfo.needed} XP para +R${nextLevelInfo.reward}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className={`flex p-1 rounded-2xl border max-w-md mx-auto ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-slate-100 border-slate-200'}`}>
                <button
                  onClick={() => setActiveTab('packs')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all font-inter ${activeTab === 'packs' ? 'bg-blue-600 text-white shadow-lg' : isDark ? 'text-zinc-500' : 'text-slate-600'}`}
                  aria-label="Pacotes"
                >
                  <Icon name="package" size={18} /> {T.tab_packs}
                </button>
                <button
                  onClick={() => setActiveTab('single')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all font-inter ${activeTab === 'single' ? 'bg-blue-600 text-white shadow-lg' : isDark ? 'text-zinc-500' : 'text-slate-600'}`}
                  aria-label="Sessão Avulsa"
                >
                  <Icon name="user" size={18} /> {T.tab_single}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(activeTab === 'single' ? DATA.services : DATA.plans).map((s: ServiceItem) => (
                  <Card
                    key={s.id}
                    active={booking.item?.id === s.id}
                    onClick={() => handleSelectItem(activeTab === 'single' ? 'single' : 'pack', s)}
                    isDark={isDark}
                  >
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-6">
                        <div className={`w-14 h-14 flex items-center justify-center rounded-2xl ${isDark ? 'bg-zinc-800 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                          <Icon name={s.icon} size={28} />
                        </div>
                        <div className="text-right">
                          {s.fullPrice && (
                            <span className={`text-xs line-through block mb-1 font-inter ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}>
                              {DATA.currency} {s.fullPrice}
                            </span>
                          )}
                          <span className="text-3xl font-bold text-blue-500 font-playfair">
                            {DATA.currency} {s.price}
                          </span>
                          {s.savings && (
                            <span className="text-xs font-bold text-emerald-500 block mt-1 font-inter">
                              Economize {DATA.currency} {s.savings}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mb-6">
                        <span className="bg-blue-500/10 text-blue-500 text-xs font-bold px-3 py-1 rounded-full uppercase border border-blue-500/20 font-inter inline-block">
                          {s.tag}
                        </span>
                        <h3 className={`text-xl font-bold mt-4 mb-2 font-playfair ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {s.title}
                        </h3>
                        <p className={`text-sm font-inter ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                          {s.desc}
                        </p>
                      </div>
                    </div>
                    <div className={`pt-4 border-t ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
                      <div className="flex items-center gap-2 text-blue-500 text-xs font-bold mb-2 uppercase tracking-wider font-inter">
                        <Icon name="alert-circle" size={14} /> {T.details_label}
                      </div>
                      <div className={`text-xs space-y-1 font-inter ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                        {s.details.split('\n').map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              <div className="py-12 relative group">
                <div className="flex items-center justify-between mb-8 px-4">
                  <h3 className={`text-2xl md:text-3xl font-playfair font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {T.reviews_title}
                  </h3>
                  <div className="hidden md:flex gap-2">
                    <button
                      onClick={() => document.getElementById('reviews-slider')?.scrollBy({ left: -320, behavior: 'smooth' })}
                      className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${isDark ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-white' : 'bg-white border-slate-200 hover:bg-slate-50 shadow-sm'}`}
                      aria-label="Anterior"
                    >
                      <Icon name="chevron-left" size={20} />
                    </button>
                    <button
                      onClick={() => document.getElementById('reviews-slider')?.scrollBy({ left: 320, behavior: 'smooth' })}
                      className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${isDark ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-white' : 'bg-white border-slate-200 hover:bg-slate-50 shadow-sm'}`}
                      aria-label="Próximo"
                    >
                      <Icon name="chevron-right" size={20} />
                    </button>
                  </div>
                </div>
                
                <div
                  id="reviews-slider"
                  className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth px-4 pb-6 -mx-4"
                  style={{ 
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                  }}
                >
                  {DATA.reviews.map((r, i) => (
                    <div key={i} className="snap-center flex-shrink-0 w-[280px] md:w-80 mx-2 first:ml-4 last:mr-4">
                      <ReviewCard review={r} isDark={isDark} />
                    </div>
                  ))}
                </div>
                
                <div className="flex md:hidden justify-center gap-1 mt-2">
                  <div className="w-8 h-1 bg-blue-500 rounded-full opacity-30"></div>
                  <div className="w-2 h-1 bg-blue-500 rounded-full opacity-10"></div>
                </div>
              </div>
              
              <div className="max-w-3xl mx-auto py-12">
                <h3 className={`text-3xl font-playfair font-bold text-center mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {T.faq_title}
                </h3>
                <div className={`border-t ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
                  {DATA.faq.map((item, idx) => (
                    <FAQItem key={idx} q={item.q} a={item.a} isDark={isDark} />
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in duration-700">
              <div className="text-center">
                <h2 className={`text-3xl font-playfair font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {T.select_time_title}
                </h2>
                <p className={`text-sm font-inter ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                  Selecione o melhor momento para seu relaxamento
                </p>
              </div>
              
              <div className="relative">
                <button
                  onClick={() => scrollDates('left')}
                  className={`hidden md:flex absolute -left-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full transition-all ${isDark ? 'bg-zinc-800 text-zinc-400 hover:text-white' : 'bg-white text-slate-500 hover:text-slate-800 shadow-md'}`}
                  aria-label="Datas anteriores"
                >
                  <Icon name="chevron-left" size={20} />
                </button>
                <div ref={dateScrollRef} className="flex gap-4 overflow-x-auto px-2 py-4 snap-x" style={{ 
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}>
                  {daysArray.map((d, idx) => {
                    const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                    const monthName = d.toLocaleDateString(lang === 'pt' ? CONFIG.LOCALE_PT : CONFIG.LOCALE_EN, { month: 'short' }).replace('.', '');
                    const dayName = d.toLocaleDateString(lang === 'pt' ? CONFIG.LOCALE_PT : CONFIG.LOCALE_EN, { weekday: 'short' }).slice(0, 3);
                    return (
                      <div key={idx} className="snap-center">
                        <button
                          onClick={() => setBooking(b => ({ ...b, date: d.toISOString(), time: null }))}
                          className={`
                            w-20 h-28 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border-2 font-inter
                            ${isSel
                              ? 'bg-blue-600 border-blue-500 text-white shadow-lg scale-110'
                              : isDark
                                ? 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                                : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                            }
                          `}
                          aria-label={`Data: ${d.toLocaleDateString()}`}
                        >
                          <span className="text-xs uppercase opacity-60">{monthName}</span>
                          <span className="text-xs uppercase opacity-80">{dayName}</span>
                          <span className="text-2xl font-bold">{d.getDate()}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={() => scrollDates('right')}
                  className={`hidden md:flex absolute -right-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full transition-all ${isDark ? 'bg-zinc-800 text-zinc-400 hover:text-white' : 'bg-white text-slate-500 hover:text-slate-800 shadow-md'}`}
                  aria-label="Próximas datas"
                >
                  <Icon name="chevron-right" size={20} />
                </button>
              </div>
              
              {!booking.date && (
                <div className={`text-center py-16 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-4 ${isDark ? 'border-zinc-800 text-zinc-600' : 'border-slate-300 text-slate-400'} font-inter`}>
                  <Icon name="calendar" size={48} />
                  <p className="text-sm font-semibold uppercase tracking-wider">{T.empty_date}</p>
                </div>
              )}
              
              {booking.date && generateTimeSlots.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {generateTimeSlots.map((t, idx) => (
                    <button
                      key={t}
                      onClick={() => setBooking(b => ({ ...b, time: t }))}
                      className={`
                        py-4 rounded-xl text-sm font-semibold border-2 transition-all font-inter
                        ${booking.time === t
                          ? isDark
                            ? 'bg-white text-black border-white shadow-lg'
                            : 'bg-slate-900 text-white border-slate-900 shadow-lg'
                          : isDark
                            ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                        }
                      `}
                      aria-label={`Horário: ${t}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
              
              {booking.date && generateTimeSlots.length === 0 && (
                <div className={`text-center py-16 rounded-2xl ${isDark ? 'bg-zinc-900/50 border border-zinc-800 text-zinc-400' : 'bg-slate-100 border border-slate-200 text-slate-500'} font-inter`}>
                  <p className="text-sm font-medium">{T.empty_slots}</p>
                </div>
              )}
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-12 animate-in fade-in duration-700">
              <h2 className={`text-3xl font-playfair font-bold text-center ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {T.location_title}
              </h2>
              
              <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                {[
                  { id: 'home', label: lang === 'pt' ? 'Residência' : 'Home', icon: 'home' },
                  { id: 'motel', label: 'Motel', icon: 'bed' },
                  { id: 'hotel', label: 'Hotel', icon: 'building' }
                ].map(x => (
                  <button
                    key={x.id}
                    onClick={() => setBooking(b => ({ ...b, locationType: x.id as any }))}
                    className={`
                      py-6 rounded-2xl flex flex-col items-center gap-3 transition-all border-2 font-inter
                      ${booking.locationType === x.id
                        ? 'bg-blue-600/10 border-blue-500 text-blue-500 shadow-lg'
                        : isDark
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                          : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                      }
                    `}
                    aria-label={`Local: ${x.label}`}
                  >
                    <Icon name={x.icon} size={32} />
                    <span className="text-xs font-bold uppercase">{x.label}</span>
                  </button>
                ))}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
                <div className="space-y-6">
                  <InputField
                    isDark={isDark}
                    label={T.input_name}
                    value={user.name}
                    onChange={(e: any) => {
                      const sanitized = sanitizeInput(e.target.value);
                      setUser(u => ({ ...u, name: sanitized }));
                    }}
                    icon="user"
                    placeholder={lang === 'pt' ? "Seu nome" : "Your name"}
                  />
                  
                  {booking.locationType === 'home' && (
                    <>
                      <div className="grid grid-cols-[1fr_100px] gap-3">
                        <InputField
                          isDark={isDark}
                          label={T.input_addr}
                          value={booking.address.street}
                          onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, street: sanitizeInput(e.target.value) } }))}
                          icon="map-pin"
                          placeholder={lang === 'pt' ? "Rua" : "Street"}
                        />
                        <InputField
                          isDark={isDark}
                          label={T.input_num}
                          value={booking.address.number}
                          onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, number: sanitizeInput(e.target.value) } }))}
                          placeholder="123"
                          type="tel"
                        />
                      </div>
                      <InputField
                        isDark={isDark}
                        label={T.input_district}
                        value={booking.address.district}
                        onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, district: sanitizeInput(e.target.value) } }))}
                        placeholder={lang === 'pt' ? "Bairro" : "District"}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <InputField
                          isDark={isDark}
                          label={T.input_city}
                          value={booking.address.city}
                          onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, city: sanitizeInput(e.target.value) } }))}
                          placeholder={lang === 'pt' ? "Cidade" : "City"}
                        />
                        <InputField
                          isDark={isDark}
                          label={T.input_comp}
                          value={booking.address.comp}
                          onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, comp: sanitizeInput(e.target.value) } }))}
                          placeholder={lang === 'pt' ? "Apto 10" : "Apt 10"}
                        />
                      </div>
                    </>
                  )}
                  
                  {booking.locationType === 'hotel' && (
                    <>
                      <InputField
                        isDark={isDark}
                        label={T.input_hotel}
                        value={booking.address.placeName}
                        onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, placeName: sanitizeInput(e.target.value) } }))}
                        icon="building"
                        placeholder={lang === 'pt' ? "Nome do hotel" : "Hotel name"}
                      />
                      <InputField
                        isDark={isDark}
                        label={T.input_city}
                        value={booking.address.city}
                        onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, city: sanitizeInput(e.target.value) } }))}
                        placeholder={lang === 'pt' ? "Cidade" : "City"}
                      />
                      <InputField
                        isDark={isDark}
                        label={T.input_room}
                        value={booking.address.comp}
                        onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, comp: sanitizeInput(e.target.value) } }))}
                        placeholder="305"
                      />
                    </>
                  )}
                  
                  {booking.locationType === 'motel' && (
                    <div className={`p-8 rounded-2xl border text-center ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-slate-50 border-slate-200'} font-inter flex flex-col items-center gap-4`}>
                      <Icon name="smartphone" size={32} className={isDark ? 'text-zinc-600' : 'text-slate-400'} />
                      <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                        {T.motel_note}
                      </p>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className={`text-sm font-bold uppercase mb-6 tracking-wider font-inter ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                    {T.extras_title}
                  </h3>
                  <div className="space-y-3">
                    {DATA.extras.map((ex, idx) => {
                      const price = booking.type !== 'single' ? Math.floor(ex.price * 0.8) : ex.price;
                      const isActive = booking.extras[ex.id];
                      return (
                        <div
                          key={ex.id}
                          onClick={() => setBooking(b => ({ ...b, extras: { ...b.extras, [ex.id]: !b.extras[ex.id] } }))}
                          className={`
                            flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all font-inter
                            ${isActive
                              ? 'bg-blue-600/10 border-blue-500/40 shadow-md'
                              : isDark
                                ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                                : 'bg-white border-slate-200 hover:border-slate-300'
                            }
                          `}
                          aria-label={`Extra: ${ex.label}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`${isActive ? 'text-blue-500' : isDark ? 'text-zinc-600' : 'text-slate-500'}`}>
                              <Icon name={ex.icon} size={20} />
                            </div>
                            <div>
                              <p className={`text-sm font-semibold ${isActive ? 'text-blue-500' : isDark ? 'text-zinc-200' : 'text-slate-700'} font-inter`}>
                                {ex.label}
                              </p>
                              <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-slate-500'} font-inter`}>{ex.desc}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            {booking.type !== 'single' && (
                              <span className={`text-xs line-through block ${isDark ? 'text-zinc-600' : 'text-slate-400'} font-inter`}>
                                {DATA.currency} {ex.price}
                              </span>
                            )}
                            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${isActive ? 'bg-blue-500/20 text-blue-500' : isDark ? 'bg-zinc-800 text-zinc-500' : 'bg-slate-100 text-slate-500'} font-inter`}>
                              + {DATA.currency} {price}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in duration-700">
              <SmartTimer isDark={isDark} text={T.timer_text} />
              
              <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
                <div className={`p-8 rounded-3xl border ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-slate-200 shadow-xl'}`}>
                  <h3 className={`text-2xl font-playfair font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Resumo da Reserva
                  </h3>
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className={`text-xs uppercase font-bold mb-1 font-inter ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                          Serviço Selecionado
                        </p>
                        <h4 className={`text-xl font-bold font-playfair ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {booking.item?.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-blue-500 font-medium mt-2 bg-blue-500/10 px-3 py-1.5 rounded-full w-fit border border-blue-500/20 font-inter">
                          <Icon name="calendar" size={14} />
                          {booking.date ? new Date(booking.date).toLocaleDateString(lang === 'pt' ? CONFIG.LOCALE_PT : CONFIG.LOCALE_EN) : ''} • {booking.time}
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-blue-500 font-playfair">
                        {DATA.currency} {booking.item?.price}
                      </span>
                    </div>
                    
                    {Object.keys(booking.extras).filter(k => booking.extras[k]).length > 0 && (
                      <div className={`pt-6 border-t ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
                        <p className={`text-xs uppercase font-bold mb-3 font-inter ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                          Adicionais
                        </p>
                        <div className="space-y-2">
                          {Object.keys(booking.extras).filter(k => booking.extras[k]).map(k => {
                            const ex = DATA.extras.find(e => e.id === k);
                            const price = booking.type !== 'single' ? Math.floor(ex!.price * 0.8) : ex!.price;
                            return (
                              <div key={k} className="flex justify-between text-sm font-inter">
                                <span className={isDark ? 'text-zinc-300' : 'text-slate-600'}>{ex!.label}</span>
                                <span className="font-semibold text-blue-500">+ {DATA.currency} {price}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    <div className={`pt-6 border-t ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
                      <div className="flex justify-between mb-2">
                        <span className={`text-sm font-inter ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{T.subtotal}</span>
                        <span className={`text-sm font-semibold font-inter ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                          {DATA.currency} {financials.sub}
                        </span>
                      </div>
                      
                      {financials.disc > 0 && (
                        <div className="flex justify-between mb-2 text-emerald-500 font-inter">
                          <span className="text-sm">{T.discount} ({booking.appliedCoupon?.title})</span>
                          <span className="text-sm font-semibold">- {DATA.currency} {financials.disc}</span>
                        </div>
                      )}
                      
                      {financials.pixDisc > 0 && (
                        <div className="flex justify-between mb-2 text-blue-400 font-inter">
                          <span className="text-sm">{T.pix_discount}</span>
                          <span className="text-sm font-semibold">- {DATA.currency} {financials.pixDisc}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center pt-4">
                        <span className={`text-xl font-bold font-playfair ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.total_label}</span>
                        <div className="text-right">
                          <span className="text-4xl font-black text-blue-500 font-playfair">
                            {DATA.currency} {financials.total}
                          </span>
                          <div className="flex items-center gap-1 text-xs font-semibold text-blue-500 mt-1 font-inter">
                            <Icon name="sparkles" size={14} /> +{estimatedXP} XP
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className={`p-6 rounded-2xl border ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-slate-200'}`}>
                    <h3 className={`text-lg font-bold font-playfair mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {T.coupon_section}
                    </h3>
                    {user.coupons.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {user.coupons.map(c => (
                          <button
                            key={c.id}
                            onClick={() => setBooking(b => ({ ...b, appliedCoupon: b.appliedCoupon?.id === c.id ? null : c }))}
                            className={`
                              px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all border font-inter
                              ${booking.appliedCoupon?.id === c.id
                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500 shadow-lg'
                                : isDark
                                  ? 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                              }
                            `}
                            aria-label={`Cupom: ${c.title}`}
                          >
                            {c.title}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className={`text-sm italic font-inter ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                        {T.no_coupons}
                      </p>
                    )}
                  </div>
                  
                  <div className={`p-6 rounded-2xl border ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-slate-200'}`}>
                    <h3 className={`text-lg font-bold font-playfair mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {T.payment_title}
                    </h3>
                    <div className="space-y-3">
                      {[
                        { id: 'pix', label: 'Pix (3% OFF)', icon: 'smartphone' },
                        { id: 'card', label: lang === 'pt' ? 'Cartão' : 'Card', icon: 'credit-card' },
                        { id: 'money', label: lang === 'pt' ? 'Dinheiro' : 'Cash', icon: 'banknote' }
                      ].map(p => (
                        <button
                          key={p.id}
                          onClick={() => setBooking(b => ({ ...b, payment: p.id }))}
                          className={`
                            w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all font-inter
                            ${booking.payment === p.id
                              ? 'bg-blue-600/10 border-blue-500 text-blue-500'
                              : isDark
                                ? 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                                : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                            }
                          `}
                          aria-label={`Pagamento: ${p.label}`}
                        >
                          <Icon name={p.icon} size={24} />
                          <span className="text-sm font-bold uppercase flex-1 text-left">{p.label}</span>
                          {booking.payment === p.id && <Icon name="check" size={20} />}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div
                    onClick={() => setTermsOpen(true)}
                    className={`
                      flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all font-inter
                      ${booking.termsAccepted
                        ? 'bg-blue-500/10 border-blue-500/40'
                        : isDark
                          ? 'border-zinc-800 hover:border-zinc-700'
                          : 'border-slate-200 hover:border-slate-300'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                        <Icon name="shield" size={24} />
                      </div>
                      <div>
                        <span className={`text-sm font-semibold block font-playfair ${isDark ? 'text-zinc-200' : 'text-slate-700'}`}>
                          {T.terms_title}
                        </span>
                        <span className={`text-xs font-inter ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                          Toque para ler todas as regras
                        </span>
                      </div>
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setBooking(b => ({ ...b, termsAccepted: !b.termsAccepted }));
                      }}
                      className={`
                        w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all
                        ${booking.termsAccepted
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : isDark ? 'border-zinc-700' : 'border-slate-300'
                        }
                      `}
                    >
                      {booking.termsAccepted && <Icon name="check" size={14} />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {step === 4 && (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-600/40 animate-bounce text-white">
                  <Icon name="check" size={40} />
                </div>
                <div className="absolute inset-0 bg-blue-600 blur-3xl opacity-20 rounded-full animate-pulse" />
              </div>
              <h2 className={`text-4xl font-playfair font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {T.success_title}
              </h2>
              <p className={`text-lg mb-8 max-w-md font-inter ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                {T.success_sub}
              </p>
              <div className="flex flex-col gap-4 w-full max-w-sm">
                <Button
                  variant="whatsapp"
                  size="xl"
                  full
                  icon="message"
                  onClick={() => window.open(generateWhatsAppLink(), '_blank')}
                >
                  {T.whatsapp_btn}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setStep(0);
                    setBooking({ 
                      ...booking, 
                      item: null, 
                      type: 'single', 
                      termsAccepted: false, 
                      appliedCoupon: null,
                      bookingId: `BOOK_${Date.now()}`
                    });
                  }}
                >
                  {T.back_home}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {step < 4 && booking.item && (
        <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 z-40 pointer-events-none">
          <div className={`
            max-w-2xl mx-auto rounded-3xl p-4 shadow-2xl border backdrop-blur-xl pointer-events-auto flex justify-between items-center transition-all font-inter
            ${isDark ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white/90 border-slate-200'}
          `}>
            {step > 0 ? (
              <button
                onClick={() => setStep(s => s - 1)}
                className={`p-3 rounded-full transition-colors ${isDark ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-slate-100 text-slate-600'}`}
                aria-label="Etapa anterior"
              >
                <Icon name="chevron-left" size={24} />
              </button>
            ) : (
              <div className="w-12" />
            )}
            
            <div className="text-center">
              <p className={`text-[10px] font-bold uppercase tracking-widest font-inter ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                {step === 3 ? T.total_label : T.subtotal}
              </p>
              <p className={`text-xl font-bold font-playfair ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {step === 3 ? `${DATA.currency} ${financials.total}` : `${DATA.currency} ${financials.sub}`}
              </p>
            </div>
            
            <Button
              onClick={handleNextStep}
              className="rounded-full !px-6"
            >
              {step === 3 ? T.finish_btn : T.next_btn} <Icon name="chevron-right" size={20} className="ml-2" />
            </Button>
          </div>
        </div>
      )}
      
      {termsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className={`relative w-full max-w-2xl rounded-3xl p-8 shadow-2xl max-h-[80vh] overflow-y-auto ${isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white'}`}>
            <button onClick={() => setTermsOpen(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-500/10" aria-label="Fechar">
              <Icon name="x" size={24} />
            </button>
            <h3 className={`text-2xl font-playfair font-bold mb-6 text-center ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.rules_complete}</h3>
            <div className="space-y-4">
              {DATA.rules.map((rule, i) => (
                <RuleItem key={i} rule={rule} isDark={isDark} />
              ))}
            </div>
            <div className="mt-8">
              <Button full onClick={() => { 
                setBooking(b => ({ ...b, termsAccepted: true })); 
                setTermsOpen(false); 
              }}>
                {T.agree_terms}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className={`relative w-full max-w-sm rounded-3xl p-8 text-center shadow-2xl ${isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white'}`}>
            <button onClick={() => setSettingsOpen(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-500/10" aria-label="Fechar">
              <Icon name="x" size={24} />
            </button>
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-500">
              <Icon name="smartphone" size={32} />
            </div>
            <h3 className={`text-xl font-playfair font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.install_app}</h3>
            <p className={`text-sm mb-6 font-inter ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{T.install_desc}</p>
            <Button full variant="secondary" onClick={() => setSettingsOpen(false)}>
              Ok
            </Button>
          </div>
        </div>
      )}
      
      {welcomePopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in zoom-in">
          <div className={`relative w-full max-w-sm rounded-[2.5rem] p-10 text-center shadow-2xl border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white'}`}>
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl rotate-12 flex items-center justify-center shadow-xl mb-4 text-white">
              <Icon name="gift" size={48} />
            </div>
            <h3 className={`text-2xl font-playfair font-bold mt-10 mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.welcome_popup_title}</h3>
            <p className={`text-sm mb-8 leading-relaxed font-inter ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{T.welcome_popup_msg}</p>
            <div className={`p-4 rounded-2xl border-2 border-dashed mb-8 ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
              <p className="text-xs font-bold uppercase text-zinc-500 mb-1 font-inter">CUPOM</p>
              <p className="text-2xl font-mono font-bold text-blue-500 tracking-wider font-playfair">BEMVINDO10</p>
            </div>
            <Button full onClick={() => {
              setWelcomePopup(false);
              setUser(u => ({ ...u, hasSeenWelcome: true }));
              const welcomeCoupon = { id: 'welcome', val: 10, title: '🎁 BEMVINDO10', code: 'BEMVINDO10' };
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in zoom-in">
          <div className={`relative w-full max-w-sm rounded-[2.5rem] p-10 text-center shadow-2xl border ${isDark ? 'bg-zinc-900 border-amber-500/20' : 'bg-white'}`}>
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-[2.5rem] pointer-events-none">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/20 blur-3xl rounded-full" />
            </div>
            <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/40 animate-bounce text-white">
              <Icon name="trophy" size={32} />
            </div>
            <h3 className={`text-3xl font-playfair font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.levelup_popup_title}</h3>
            <p className={`text-sm mb-8 font-inter ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{T.levelup_popup_msg}</p>
            <Button full variant="primary" className="!bg-amber-600 hover:!bg-amber-700 shadow-amber-600/20" onClick={() => setLevelUpPopup(false)}>Uhuul!</Button>
          </div>
        </div>
      )}
    </>
  );
}
