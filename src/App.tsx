import * as React from 'react';
import { useState, useEffect, useMemo, useRef, useCallback, memo } from 'react';

// ==================================================================================
// 1. UTILITÁRIOS E CONSTANTES GLOBAIS (Melhoria de Performance)
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413",
  INSTAGRAM: "https://instagram.com/thalyson.massagens",
  STORAGE_KEY: '@thaly_app_v3_ultra', // Key atualizada para limpar cache antigo
  VERSION: '3.0.1',
  PIX_KEY: "62.922.530/0001-14",
  SECRET_TOKEN: 'THALY_SECURE_V5',
  START_HOUR: 9,
  END_HOUR: 21, // Estendido para captar clientes noturnos
  ANIMATION_SPEED: 0.3
} as const;

// Helper de vibração (Haptic Feedback) - Melhoria de UX Tátil
const vibrate = (pattern = 10) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

// SVG Paths otimizados
const ICONS: Record<string, string> = {
  'menu': 'M4 6h16M4 12h16M4 18h16',
  'x': 'M18 6L6 18M6 6l12 12',
  'check': 'M20 6L9 17l-5-5',
  'chevron-left': 'M15 18l-6-6 6-6',
  'chevron-right': 'M9 18l6-6-6-6',
  'chevron-down': 'M6 9l6 6 6-6',
  'star': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  'user': 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z',
  'map-pin': 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 10a3 3 0 100-6 3 3 0 000 6z',
  'calendar': 'M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z',
  'clock': 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z',
  'phone': 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.12 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 016 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z',
  'shield': 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  'zap': 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  'package': 'M12.89 1.45l8 4A2 2 0 0122 7.24v9.53a2 2 0 01-1.11 1.79l-8 4a2 2 0 01-1.79 0l-8-4a2 2 0 01-1.1-1.8V7.24a2 2 0 011.11-1.79l8-4a2 2 0 011.78 0z',
  'sparkles': 'M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6L12 2z', // Simplificado
  'moon': 'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z',
  'sun': 'M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 8a4 4 0 100 8 4 4 0 000-8z',
  'award': 'M12 15l-2 5-9-9 9-9 9 9-9 9-2-5',
  'gift': 'M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7m16-4h-4m-8 0H4m12 0a2 2 0 104 0m-4 0a2 2 0 11-4 0m0 0H8m4 0a2 2 0 11-4 0m0 0a2 2 0 10-4 0m4 8v7m0-7v-4',
  'credit-card': 'M21 4H3a2 2 0 00-2 2v12a2 2 0 002 2h18a2 2 0 002-2V6a2 2 0 00-2-2zm0 14H3V10h18v8zm0-10H3V6h18v2z',
  'share': 'M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13',
  'home': 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z',
  'bed': 'M2 4v16M2 8h18a2 2 0 012 2v10M2 17h20M6 8v9',
  'camera': 'M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z',
  'video': 'M23 7l-7 5 7 5V7zM14 5H3a2 2 0 00-2 2v10a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2z',
  'scissors': 'M6 9l6 6 6-6', // Simplificado
  'play': 'M5 3l14 9-14 9V3z', // Added for playlist
  'alert': 'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01'
};

// ==================================================================================
// 2. DESIGN SYSTEM & COMPONENTES (Memoizados)
// ==================================================================================

const Icon = memo(({ name, size = 20, className = "", isEmoji = false }: any) => {
  if (isEmoji) return <span className={`emoji-icon ${className}`} style={{ fontSize: size }}>{name}</span>;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d={ICONS[name] || ''} />
    </svg>
  );
});

// Estilos globais injetados (Evita FOUC e melhora scroll)
const GlobalStyles = memo(({ isDark }: { isDark: boolean }) => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
    :root { --font-sans: 'Outfit', sans-serif; --font-serif: 'Playfair Display', serif; }
    html, body { 
      background-color: ${isDark ? '#050505' : '#f0f4f8'}; 
      color: ${isDark ? '#e5e5e5' : '#1e293b'}; 
      font-family: var(--font-sans); 
      -webkit-tap-highlight-color: transparent;
      scroll-behavior: smooth;
    }
    .glass { background: ${isDark ? 'rgba(20, 20, 22, 0.75)' : 'rgba(255, 255, 255, 0.85)'}; backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.6)'}; }
    .gold-gradient { background: linear-gradient(135deg, #FFD700 0%, #FDB931 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .hide-scroll::-webkit-scrollbar { display: none; }
    .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
    input:-webkit-autofill { -webkit-box-shadow: 0 0 0 1000px ${isDark ? '#09090b' : '#ffffff'} inset !important; -webkit-text-fill-color: ${isDark ? '#fff' : '#000'} !important; }
    @keyframes pulse-soft { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.85; transform: scale(0.98); } }
    .animate-pulse-soft { animation: pulse-soft 2s infinite; }
  `}} />
));

// Botão com efeito de "Press" e Haptics
const Button = memo(({ children, onClick, variant = 'primary', size = 'md', disabled = false, full = false, icon, className = '', loading = false }: any) => {
  const handleClick = (e: any) => {
    if (disabled || loading) return;
    vibrate(15);
    onClick && onClick(e);
  };
  
  const base = "relative overflow-hidden inline-flex items-center justify-center font-bold tracking-wide transition-all duration-200 rounded-xl active:scale-[0.96] disabled:opacity-50 disabled:cursor-not-allowed select-none";
  const vs = {
    primary: "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20 hover:shadow-blue-600/30",
    gold: "bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-500/25",
    whatsapp: "bg-[#25D366] text-white hover:bg-[#20BD5A] shadow-lg shadow-green-900/20",
    outline: "border-2 border-current bg-transparent opacity-80 hover:opacity-100",
    ghost: "bg-transparent hover:bg-white/5"
  };
  const ss = { sm: "h-9 text-xs px-3", md: "h-12 text-sm px-6", lg: "h-14 text-base px-8", xl: "h-16 text-lg px-8" };
  
  return (
    <button onClick={handleClick} disabled={disabled} className={`${base} ${vs[variant as keyof typeof vs]} ${ss[size as keyof typeof ss]} ${full ? 'w-full' : ''} ${className}`}>
      {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>{icon && <span className="mr-2"><Icon name={icon} size={20} /></span>}{children}</>}
    </button>
  );
});

// Timer Inteligente (Anti-Cheat: Persiste na sessão)
const SmartTimer = memo(({ isDark }: { isDark: boolean }) => {
  const [time, setTime] = useState(() => {
    if (typeof sessionStorage !== 'undefined') {
        const saved = sessionStorage.getItem('thaly_timer');
        return saved ? parseInt(saved) : 600;
    }
    return 600;
  });

  useEffect(() => {
    if (time <= 0) return;
    const interval = setInterval(() => {
      setTime(t => {
        const nt = t - 1;
        sessionStorage.setItem('thaly_timer', nt.toString());
        return nt;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [time]);

  const m = Math.floor(time / 60);
  const s = time % 60;
  
  return (
    <div className={`flex items-center justify-center gap-2 py-2 px-4 rounded-full border text-xs font-mono font-bold ${time < 120 ? 'bg-red-500/10 border-red-500 text-red-500 animate-pulse' : isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-400' : 'bg-white border-slate-200 text-slate-600'}`}>
      <Icon name="clock" size={14} />
      <span>SEGURANDO VAGA: {m}:{s < 10 ? `0${s}` : s}</span>
    </div>
  );
});

// ==================================================================================
// 3. LOGICA DE DADOS & NEGÓCIO
// ==================================================================================

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
};

const DATA_CORE = (lang: string) => {
  const isPT = lang === 'pt';
  const R = (v: number) => isPT ? v : Math.round(v / 5.8);
  const C = isPT ? 'R$' : '$';

  return {
    currency: C,
    services: [
      { id: 'relax', title: 'Relaxante Clássica', price: R(145), oldPrice: R(180), time: 60, icon: 'user', tag: 'MAIS PEDIDA', desc: 'Alívio muscular e mental profundo.', color: 'blue' },
      { id: 'tantra', title: 'Tântrica Sensorial', price: R(175), oldPrice: R(220), time: 60, icon: 'sparkles', tag: 'PREMIUM', desc: 'Reconexão e despertar de energia.', color: 'purple' },
      { id: 'fusion', title: 'Fusion Experience', price: R(205), oldPrice: R(250), time: 75, icon: 'zap', tag: 'VIP', desc: 'O melhor de dois mundos. Intensa.', color: 'amber' },
      { id: 'depil', title: 'Depilação Body', price: R(110), oldPrice: null, time: 45, icon: 'scissors', tag: 'ESTÉTICA', desc: 'Higiene e cuidado visual (Máquina).', color: 'slate' }
    ],
    extras: [
      { id: 'aromaterapia', label: 'Aromaterapia', price: R(15), icon: '🌿', desc: 'Óleos essenciais' },
      { id: 'pedras', label: 'Pedras Quentes', price: R(30), icon: '🪨', desc: 'Relaxamento térmico' },
      { id: 'more_time', label: '+30 Minutos', price: R(70), icon: '⏱️', desc: 'Estender sessão' },
      { id: 'shower', label: 'Banho Premium', price: R(20), icon: '🚿', desc: 'Sais e espuma' }
    ],
    reviews: [
      { name: 'Giovana', txt: 'Mãos de fada! Precisava dessa paz.', stars: 5, verified: true },
      { name: 'Roberto', txt: 'A Tântrica mudou minha semana. Surreal.', stars: 5, verified: true },
      { name: 'Lucas', txt: 'Profissional e muito discreto. Recomendo.', stars: 5, verified: true }
    ]
  };
};

// ==================================================================================
// 4. COMPONENTE PRINCIPAL
// ==================================================================================

export default function ThalysonApp() {
  // Estado Global
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState('pt');
  
  // Dados do Usuário & Booking
  const [user, setUser] = useState({ name: '', phone: '', xp: 0, level: 1 });
  const [booking, setBooking] = useState({
    service: null as any,
    extras: {} as Record<string, boolean>,
    date: null as string | null,
    time: null as string | null,
    address: { street: '', number: '', comp: '', city: 'Santa Fé do Sul' },
    payment: 'pix',
    obs: ''
  });

  // Refs
  const scrollRef = useRef<HTMLDivElement>(null);

  // Inicialização Otimizada
  useEffect(() => {
    // Restaurar tema e dados
    const savedTheme = localStorage.getItem('thaly_theme');
    if (savedTheme) setIsDark(savedTheme === 'dark');
    
    const savedUser = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (savedUser) setUser(JSON.parse(savedUser));

    // Simular loading inicial "Premium"
    setTimeout(() => setLoading(false), 1500);
  }, []);

  // Persistência automática
  useEffect(() => {
    localStorage.setItem('thaly_theme', isDark ? 'dark' : 'light');
    if (user.name) localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(user));
  }, [isDark, user]);

  // Scroll automático no Step Change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    vibrate(20);
  }, [step]);

  // Data helpers
  const D = DATA_CORE(lang);
  
  // Geração de Datas (Dinâmica)
  const dates = useMemo(() => {
    const arr = [];
    const today = new Date();
    for(let i=0; i<14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, []);

  // Geração de Horários (Inteligente - Remove passados)
  const timeSlots = useMemo(() => {
    if (!booking.date) return [];
    const slots = [];
    const now = new Date();
    const selDate = new Date(booking.date);
    const isToday = selDate.toDateString() === now.toDateString();
    
    for (let h = CONFIG.START_HOUR; h <= CONFIG.END_HOUR; h++) {
      if (isToday && h <= now.getHours()) continue;
      slots.push(`${h}:00`);
      slots.push(`${h}:30`);
    }
    return slots;
  }, [booking.date]);

  // Calculadora Financeira (Memoizada)
  const finance = useMemo(() => {
    let total = booking.service?.price || 0;
    let savings = (booking.service?.oldPrice || 0) - total;
    
    D.extras.forEach(ex => {
      if (booking.extras[ex.id]) total += ex.price;
    });

    let discount = 0;
    if (booking.payment === 'pix') discount = Math.ceil(total * 0.05); // 5% Pix
    
    return { subtotal: total, total: total - discount, discount, savings: Math.max(0, savings) };
  }, [booking, D.extras]);

  // Gerador de Link WhatsApp (Encoder seguro)
  const finishBooking = () => {
    vibrate([50, 50, 50]);
    // Atualizar XP
    setUser(u => ({ ...u, xp: u.xp + Math.floor(finance.total / 10) }));
    
    const text = `
*NOVA RESERVA VIP* 🌟
-------------------------------
👤 *Cliente:* ${user.name}
📅 *Data:* ${new Date(booking.date!).toLocaleDateString('pt-BR')}
⏰ *Hora:* ${booking.time}
💆‍♂️ *Serviço:* ${booking.service.title}

➕ *Adicionais:*
${Object.keys(booking.extras).filter(k => booking.extras[k]).map(k => `• ${D.extras.find(e => e.id === k)?.label}`).join('\n') || 'Nenhum'}

📍 *Local:*
${booking.address.street}, ${booking.address.number}
${booking.address.comp ? `(${booking.address.comp})` : ''} - ${booking.address.city}

💰 *Pagamento:* ${booking.payment.toUpperCase()}
💵 *Total:* ${D.currency} ${finance.total},00
-------------------------------
_Aguardando confirmação..._
    `.trim();

    window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(text)}`, '_blank');
    setStep(4);
  };

  if (loading) return (
    <div className={`fixed inset-0 flex flex-col items-center justify-center z-50 ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center font-serif font-bold text-3xl">T</div>
      </div>
      <p className="tracking-[0.3em] text-xs font-bold uppercase animate-pulse">Carregando Experiência...</p>
    </div>
  );

  return (
    <>
      <GlobalStyles isDark={isDark} />
      
      {/* Background Dinâmico */}
      <div className={`fixed inset-0 z-[-1] transition-colors duration-500 ${isDark ? 'bg-[#09090b]' : 'bg-slate-50'}`}>
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full filter blur-[120px] opacity-20 ${isDark ? 'bg-blue-900' : 'bg-blue-200'}`} />
        <div className={`absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full filter blur-[100px] opacity-20 ${isDark ? 'bg-indigo-900' : 'bg-indigo-200'}`} />
      </div>

      {/* Header Sticky */}
      <header className={`fixed top-0 left-0 right-0 z-40 px-6 py-4 glass flex justify-between items-center transition-all ${step > 0 ? 'shadow-lg' : ''}`}>
        <div className="flex items-center gap-3" onClick={() => step > 0 && setStep(0)}>
            {step > 0 && <Icon name="chevron-left" className="cursor-pointer" />}
            <div>
                <h1 className="font-serif font-bold text-xl leading-none">Thalyson</h1>
                <p className="text-[10px] uppercase tracking-widest text-blue-500 font-bold">Massagens</p>
            </div>
        </div>
        <div className="flex items-center gap-3">
            <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                <Icon name={isDark ? 'sun' : 'moon'} size={18} />
            </button>
            <div className="text-right hidden sm:block">
                <p className="text-[10px] text-gray-500 font-bold">XP</p>
                <p className="text-sm font-bold text-amber-500">{user.xp}</p>
            </div>
        </div>
      </header>

      <main className="pt-24 pb-32 px-4 max-w-2xl mx-auto min-h-screen">
        
        {/* STEP 0: HOME / SERVIÇOS */}
        {step === 0 && (
          <div className="animate-fade-in space-y-8">
            <div className="text-center space-y-2 py-4">
               <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold uppercase tracking-wider mb-2 inline-block">
                 {getGreeting()}, {user.name.split(' ')[0] || 'Visitante'}
               </span>
               <h2 className="text-4xl font-serif font-bold leading-tight">
                 Qual experiência <br/> <span className="text-blue-500">você deseja?</span>
               </h2>
               <p className={`text-sm max-w-xs mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                 Massagens profissionais no conforto da sua casa ou hotel.
               </p>
            </div>

            {/* Stories / Reviews Rápidas */}
            <div className="flex gap-3 overflow-x-auto hide-scroll pb-2 -mx-4 px-4">
               {D.reviews.map((r, i) => (
                   <div key={i} className={`flex-shrink-0 w-64 p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100 shadow-sm'}`}>
                       <div className="flex gap-1 mb-2 text-amber-400"><Icon name="star" size={12} isEmoji={false}/><Icon name="star" size={12}/><Icon name="star" size={12}/><Icon name="star" size={12}/><Icon name="star" size={12}/></div>
                       <p className="text-xs italic opacity-80 mb-2">"{r.txt}"</p>
                       <p className="text-xs font-bold flex items-center gap-1">{r.name} {r.verified && <Icon name="check" size={10} className="text-blue-500"/>}</p>
                   </div>
               ))}
            </div>

            {/* Lista de Serviços */}
            <div className="grid gap-4">
              {D.services.map((s) => (
                <div 
                  key={s.id}
                  onClick={() => { setBooking({...booking, service: s}); setStep(1); }}
                  className={`group relative p-6 rounded-3xl border transition-all duration-300 cursor-pointer overflow-hidden
                    ${isDark ? 'bg-zinc-900/60 border-zinc-800 hover:border-blue-500/50' : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-xl'}
                  `}
                >
                  {/* Badge */}
                  {s.tag && (
                    <div className="absolute top-4 right-4 px-2 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-md uppercase shadow-lg shadow-blue-600/20">
                      {s.tag}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${isDark ? 'bg-zinc-800 text-white' : 'bg-blue-50 text-blue-600'}`}>
                      <Icon name={s.icon} size={24} />
                    </div>
                    <div className="text-right">
                       {s.oldPrice && <span className="text-xs text-gray-500 line-through block">{D.currency} {s.oldPrice}</span>}
                       <span className="text-2xl font-bold font-serif text-blue-500">{D.currency} {s.price}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold mb-1">{s.title}</h3>
                  <p className={`text-xs mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{s.desc}</p>
                  
                  <div className="flex items-center gap-3 text-xs font-semibold opacity-60">
                    <span className="flex items-center gap-1"><Icon name="clock" size={12} /> {s.time} min</span>
                    <span>•</span>
                    <span>Presencial</span>
                  </div>
                  
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
            
            {/* Link para Playlist (Feature "Mood") */}
            <div className={`p-4 rounded-xl flex items-center justify-between cursor-pointer ${isDark ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-700'}`}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white"><Icon name="play" /></div>
                    <div className="text-xs">
                        <p className="font-bold">Ouça minha playlist</p>
                        <p className="opacity-70">Entre no clima antes da sessão</p>
                    </div>
                </div>
                <Icon name="chevron-right" size={16} />
            </div>
          </div>
        )}

        {/* STEP 1: DATA E HORA */}
        {step === 1 && (
          <div className="animate-fade-in space-y-8">
            <div className="text-center">
               <h2 className="text-2xl font-serif font-bold mb-2">Quando será?</h2>
               <p className="text-sm opacity-60">Selecione o melhor momento para você.</p>
            </div>

            {/* Seletor de Data Horizontal */}
            <div className="relative">
                <div className="flex gap-3 overflow-x-auto hide-scroll pb-4 snap-x">
                    {dates.map((d, i) => {
                        const isSel = booking.date === d.toISOString();
                        const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                        return (
                            <button
                                key={i}
                                onClick={() => setBooking({...booking, date: d.toISOString(), time: null})}
                                className={`snap-center flex-shrink-0 w-16 h-20 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border-2
                                    ${isSel 
                                        ? 'border-blue-500 bg-blue-600 text-white shadow-lg scale-105' 
                                        : isDark ? 'border-zinc-800 bg-zinc-900 text-gray-400' : 'border-gray-200 bg-white text-gray-500'}
                                `}
                            >
                                <span className="text-[10px] uppercase font-bold">{d.toLocaleDateString('pt-BR', {weekday: 'short'}).slice(0,3)}</span>
                                <span className="text-xl font-bold">{d.getDate()}</span>
                                {isWeekend && <span className="w-1 h-1 rounded-full bg-amber-500" />}
                            </button>
                        )
                    })}
                </div>
                <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-current to-transparent opacity-10 pointer-events-none" />
            </div>

            {/* Slots de Tempo */}
            {booking.date && (
                <div className="grid grid-cols-4 gap-3 animate-slide-up">
                    {timeSlots.length > 0 ? timeSlots.map(t => (
                        <button
                            key={t}
                            onClick={() => setBooking({...booking, time: t})}
                            className={`py-3 rounded-xl text-sm font-bold border transition-all ${booking.time === t ? 'bg-white text-black border-white shadow-xl' : isDark ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700' : 'bg-white border-gray-200 text-gray-600'}`}
                        >
                            {t}
                        </button>
                    )) : (
                        <p className="col-span-4 text-center py-8 opacity-50 text-sm">Sem horários para hoje.</p>
                    )}
                </div>
            )}
          </div>
        )}

        {/* STEP 2: DETALHES & EXTRAS */}
        {step === 2 && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-serif font-bold text-center">Personalize</h2>
            
            {/* Inputs de Endereço */}
            <div className={`p-6 rounded-3xl border space-y-4 ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-gray-100 shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-2 text-blue-500 text-xs font-bold uppercase tracking-wider">
                    <Icon name="map-pin" size={14} /> Onde atendo você?
                </div>
                <input 
                    type="text" 
                    placeholder="Seu Nome Completo"
                    value={user.name}
                    onChange={e => setUser({...user, name: e.target.value})}
                    className="w-full bg-transparent border-b border-gray-700 p-2 focus:border-blue-500 outline-none transition-colors"
                />
                <div className="grid grid-cols-[3fr_1fr] gap-4">
                    <input 
                        type="text" 
                        placeholder="Rua / Hotel"
                        value={booking.address.street}
                        onChange={e => setBooking({...booking, address: {...booking.address, street: e.target.value}})}
                        className="w-full bg-transparent border-b border-gray-700 p-2 focus:border-blue-500 outline-none"
                    />
                    <input 
                        type="tel" 
                        placeholder="Nº"
                        value={booking.address.number}
                        onChange={e => setBooking({...booking, address: {...booking.address, number: e.target.value}})}
                        className="w-full bg-transparent border-b border-gray-700 p-2 focus:border-blue-500 outline-none"
                    />
                </div>
            </div>

            {/* Extras (Upsell) */}
            <div>
                <h3 className="text-sm font-bold opacity-60 uppercase mb-4 px-2">Adicione à experiência</h3>
                <div className="space-y-3">
                    {D.extras.map(ex => {
                        const active = booking.extras[ex.id];
                        return (
                            <div 
                                key={ex.id}
                                onClick={() => { vibrate(10); setBooking(b => ({...b, extras: {...b.extras, [ex.id]: !active}})) }}
                                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${active ? 'bg-blue-600/10 border-blue-500 ring-1 ring-blue-500' : isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{ex.icon}</span>
                                    <div>
                                        <p className={`text-sm font-bold ${active ? 'text-blue-500' : ''}`}>{ex.label}</p>
                                        <p className="text-[10px] opacity-60">{ex.desc}</p>
                                    </div>
                                </div>
                                <div className="text-xs font-bold bg-gray-500/10 px-2 py-1 rounded">+ {D.currency}{ex.price}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
          </div>
        )}

        {/* STEP 3: RESUMO E PAGAMENTO */}
        {step === 3 && (
          <div className="animate-fade-in space-y-6">
            <SmartTimer isDark={isDark} />
            
            <div className={`p-6 rounded-3xl border relative overflow-hidden ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200 shadow-xl'}`}>
                {/* Efeito de background */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
                
                <h3 className="text-xl font-serif font-bold mb-6">Resumo</h3>
                
                <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="opacity-70">{booking.service?.title}</span>
                        <span className="font-bold">{D.currency} {booking.service?.price}</span>
                    </div>
                    
                    {Object.keys(booking.extras).filter(k => booking.extras[k]).map(k => (
                        <div key={k} className="flex justify-between items-center text-xs text-blue-500">
                            <span>+ {D.extras.find(e => e.id === k)?.label}</span>
                            <span>{D.currency} {D.extras.find(e => e.id === k)?.price}</span>
                        </div>
                    ))}

                    <div className="h-px bg-gray-500/20 my-4" />
                    
                    {/* Opções de Pagamento */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <button 
                            onClick={() => setBooking({...booking, payment: 'pix'})}
                            className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${booking.payment === 'pix' ? 'bg-blue-600 border-blue-600 text-white' : 'opacity-50 hover:opacity-100 border-gray-600'}`}
                        >
                            <Icon name="zap" className="mx-auto mb-1" size={16} />
                            PIX (-5%)
                        </button>
                        <button 
                            onClick={() => setBooking({...booking, payment: 'card'})}
                            className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${booking.payment === 'card' ? 'bg-blue-600 border-blue-600 text-white' : 'opacity-50 hover:opacity-100 border-gray-600'}`}
                        >
                            <Icon name="credit-card" className="mx-auto mb-1" size={16} />
                            CARTÃO
                        </button>
                    </div>

                    <div className="flex justify-between items-end">
                        <span className="text-sm font-bold opacity-60">Total Final</span>
                        <div className="text-right">
                             {finance.savings > 0 && <span className="block text-[10px] text-green-500 font-bold mb-1">Economia de {D.currency}{finance.savings + finance.discount}</span>}
                             <span className="text-3xl font-serif font-bold text-blue-500">{D.currency} {finance.total}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center text-xs opacity-50 px-6">
                Ao confirmar, você concorda com nossa política de cancelamento de 2h de antecedência.
            </div>
          </div>
        )}

        {/* STEP 4: SUCESSO */}
        {step === 4 && (
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-center animate-fade-in">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-green-500/30 mb-8 animate-bounce">
                  <Icon name="check" size={48} />
              </div>
              <h2 className="text-3xl font-serif font-bold mb-4">Pedido Enviado!</h2>
              <p className="opacity-70 max-w-xs mx-auto mb-8">Agora finalize a conversa no WhatsApp para confirmar o agendamento.</p>
              <Button variant="ghost" onClick={() => { setStep(0); setBooking({...booking, service: null, date: null, time: null}) }}>
                  Voltar ao Início
              </Button>
          </div>
        )}

      </main>

      {/* FOOTER ACTION BAR */}
      {step > 0 && step < 4 && (
          <div className={`fixed bottom-0 left-0 right-0 p-4 z-50 glass border-t border-t-white/10 ${isDark ? 'bg-black/80' : 'bg-white/80'}`}>
             <div className="max-w-2xl mx-auto flex items-center gap-4">
                 <div className="flex-1">
                     <p className="text-[10px] uppercase font-bold opacity-60">Total Estimado</p>
                     <p className="text-xl font-bold font-serif">{D.currency} {finance.total}</p>
                 </div>
                 <Button 
                    variant="primary" 
                    size="lg" 
                    className="w-48 rounded-2xl"
                    disabled={step === 1 && !booking.time || step === 2 && !booking.address.street}
                    onClick={() => step === 3 ? finishBooking() : setStep(s => s+1)}
                 >
                    {step === 3 ? 'Confirmar' : 'Continuar'} <Icon name="chevron-right" className="ml-2" />
                 </Button>
             </div>
          </div>
      )}

    </>
  );
}
