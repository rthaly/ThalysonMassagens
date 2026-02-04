import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Ticket, Flame, Wind, 
  Clock, Zap, X, Globe, Building, BedDouble, 
  Heart, Instagram, Moon, Sun, Home, 
  CreditCard, Banknote, QrCode, Trophy, Info, Gift, 
  ChevronLeft, ChevronRight, Loader2, ShieldCheck, AlertTriangle, Tag, Sparkles, 
  MapPin, Calendar, Smartphone, Crown, LayoutList, Package, 
  Lock, User, Quote, Share2, ExternalLink, Copy, ChevronDown
} from 'lucide-react';

/**
 * ==================================================================================
 * THALYSON APP OS v43.0 - PLATINUM EDITION (VERTICAL + INFINITE REVIEWS)
 * ==================================================================================
 * 1. AVALIAÇÕES: Loop Infinito Automático (JS Physics) restaurado.
 * 2. UX: Vertical Flow (Cascata) + Glassmorphism (Vidro Azul).
 * 3. LÓGICA: Fast Track (Hora atual liberada) + Persistência Local.
 * 4. LAYOUT: Mobile First (Toque fácil) + Desktop Split (Resumo fixo).
 */

// --- 1. CONFIGURAÇÕES & DADOS ---

const CONFIG = {
  PHONE: "5517991360413", 
  INSTAGRAM_URL: "https://instagram.com/thalyson.massagens", 
  STORAGE_KEY: '@thaly_app_v43_platinum', 
  PIX_KEY: "62922530000144",
  PIX_DISPLAY: "62.922.530/0001-44",
  SECRET_TOKEN: 'PLATINUM_2026',
  START_HOUR: 9,
  END_HOUR: 20
};

const getData = () => ({
    services: [
        { 
          id: 'relaxante', min: 60, price: 125, icon: Wind, tag: "TERAPÊUTICA",
          title: "Sessão Relaxante", desc: "Alívio muscular e mental profundo.",
          details: `FOCO NO ALÍVIO:
• COMO É: Massagem profunda para tirar tensão e dores do corpo.
• LIMITE: **Não possui toques íntimos.** Apenas relaxamento muscular.
• IDEAL PARA: Quem está travado, cansado ou estressado.` 
        },
        { 
          id: 'sensitiva', min: 60, price: 155, icon: Flame, tag: "SENSORIAL",
          title: "Terapia Sensitiva", desc: "Um despertar suave do corpo.",
          details: `CONEXÃO SUTIL:
• INÍCIO: Começamos sempre com a relaxante para soltar o corpo.
• EVOLUÇÃO: Toques leves (ponta dos dedos) percorrendo a pele.
• FINAL: A massagem íntima faz parte. O gozar é permitido e natural.`
        },
        { 
          id: 'mista', min: 60, price: 195, icon: Zap, tag: "COMPLETA (TOP 1)",
          title: "Experiência Mista", desc: "A fusão do relaxamento com o intenso.",
          details: `A ESCOLHA FAVORITA:
• INÍCIO: Relaxante muscular completa.
• MEIO: Evolui para sensitiva e contato corpo a corpo (Body).
• FINAL: Liberdade total. O clímax (gozar) é bem-vindo e faz parte do alívio.`
        }
    ],
    plans: [
        { 
          id: 'pack_relax', type: 'pack', title: "Ciclo Relax (4x)", 
          price: 397, fullPrice: 500, savings: 103, 
          desc: "Contém: 4 Sessões Relaxantes (1h).",
          details: "Ideal para tratamento de dores crônicas ou estresse acumulado. As 4 sessões são focadas em relaxamento muscular (sem parte íntima).", 
          tag: "ECONOMIA", icon: Package 
        },
        { 
          id: 'pack_mista', type: 'pack', title: "Ciclo Completo (3x)", 
          price: 487, fullPrice: 585, savings: 98, 
          desc: "Contém: 3 Sessões Mistas (1h).",
          details: "A rotina perfeita. São 3 sessões da experiência completa (Mista), unindo relaxamento muscular e finalização.", 
          tag: "PREFERIDO", icon: Zap 
        },
        { 
          id: 'vip_club', type: 'subscription', title: "Clube Mensal", 
          price: 297, fullPrice: 390, savings: 93, 
          desc: "Mensalidade: 2 Sessões Mistas.",
          details: "Garanta seu bem-estar mensal. Inclui 2 Sessões Mistas por mês + Prioridade na escolha de horários.", 
          tag: "VIP", icon: Crown 
        }
    ],
    extras: [
        { id: 'more_time', price: 55, icon: Clock, label: "+30 Minutos", desc: "Para não ter pressa." },
        { id: 'touch', price: 55, icon: Heart, label: "Interatividade", desc: "Você toca também." },
        { id: 'aroma', price: 5, icon: Wind, label: "Aromaterapia", desc: "Essência no ar." }
    ],
    reviews: [
        { n: "Bruno", loc: "SP - Bela Vista", t: "Thalyson, quero dizer que sua massagem foi muito bem executada. Você primeiro conhece o corpo para ir executando o procedimento com muito cuidado e segurança.", s: 5 },
        { n: "Tiago", loc: "SP - Bela Vista", t: "O Thalyson tem uma energia surreal. A massagem foi perfeita, melhor da minha vida.", s: 5 },
        { n: "Ricardo M.", loc: "Rio Preto", t: "Mão firme. Consegui relaxar de verdade, coisa que não fazia há tempos.", s: 5 },
        { n: "André L.", loc: "SP - Bela Vista", t: "O toque dele é diferente. Me senti muito à vontade.", s: 5 },
        { n: "Gustavo", loc: "Santa Fé do Sul", t: "Gostei muito da energia, pessoa do bem. Recomendo.", s: 4 },
        { n: "Renato", loc: "SP - Centro", t: "Muito respeitoso e profissional. A sensitiva é uma experiência única.", s: 5 },
        { n: "Pedro", loc: "Rio Preto", t: "A energia do corpo a corpo é intensa. Me senti renovado.", s: 5 },
        { n: "Felipe", loc: "Londrina", t: "Fiquei na dúvida por ser no sofá, mas foi surpreendentemente confortável.", s: 5 },
        { n: "Roberto", loc: "SP - Augusta", t: "Pedi com interação. Foi uma troca muito gostosa.", s: 5 }
    ],
    levels: [
        { lvl: 1, xp: 0, title: "Visitante" },
        { lvl: 2, xp: 100, title: "Bronze" },
        { lvl: 3, xp: 350, title: "Prata" },
        { lvl: 4, xp: 800, title: "Ouro" }
    ],
    terms: [
        "1. HIGIENE: Um banho prévio ajuda no nosso conforto.",
        "2. SIGILO: Sua privacidade é absoluta comigo.",
        "3. AMBIENTE: Adapto o atendimento ao seu espaço (Cama/Sofá).",
        "4. RESPEITO: Um espaço livre de julgamentos.",
        "5. SAÚDE: Confirmo que estou saudável e sem sintomas."
    ]
});

// ==================================================================================
// 2. ESTILOS GLOBAIS
// ==================================================================================
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
    
    :root {
      --color-bg: #020617; /* Slate 950 */
      --color-glass: rgba(15, 23, 42, 0.7);
      --color-glass-border: rgba(255, 255, 255, 0.08);
    }

    body { 
      font-family: 'Poppins', sans-serif; 
      background-color: var(--color-bg);
      color: #f8fafc;
      overflow-x: hidden;
    }
    
    .glass-panel {
      background: var(--color-glass);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--color-glass-border);
    }
    
    .glass-card {
      background: rgba(30, 41, 59, 0.3);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.05);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }

    .hide-scrollbar::-webkit-scrollbar { display: none; }
    
    /* Animações de Scroll e Entrada */
    .reveal-section { 
      animation: reveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      opacity: 0;
      transform: translateY(20px);
    }
    
    @keyframes reveal { to { opacity: 1; transform: translateY(0); } }
  `}</style>
);

// ==================================================================================
// 3. COMPONENTES UI (GLASS & BLUE)
// ==================================================================================

const Button = ({ children, onClick, variant = 'primary', size = 'md', disabled = false, full = false, icon: Icon, className = '', loading = false }) => {
  const baseStyle = "relative flex items-center justify-center font-semibold tracking-wide transition-all duration-200 active:scale-[0.97] rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sky-500/20 hover:brightness-110",
    secondary: "bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700",
    whatsapp: "bg-[#25D366] text-white shadow-green-500/20 hover:brightness-105",
    outline: "bg-transparent border-2 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white",
  };
  
  const sizes = { 
    sm: "h-10 text-xs px-4", 
    md: "h-14 text-sm px-6", 
    lg: "h-16 text-base px-8", 
    icon: "h-12 w-12 p-0 rounded-full"
  };

  return (
    <button onClick={onClick} disabled={disabled || loading} className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${full ? 'w-full' : ''} ${className}`}>
      {loading ? <Loader2 size={20} className="animate-spin"/> : (
        <>
          {Icon && <Icon size={20} className={children ? "mr-2.5" : ""} strokeWidth={2.5} />}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

const InputField = ({ label, value, onChange, placeholder, icon: Icon, type = "text", mask }) => {
    const handleChange = (e) => {
        let val = e.target.value;
        if (mask) val = mask(val);
        onChange(val);
    };
    return (
      <div className="w-full space-y-2">
        {label && <label className="text-[10px] font-bold uppercase tracking-wider text-sky-500 ml-1">{label}</label>}
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-400 transition-colors">{Icon && <Icon size={20} />}</div>
          <input 
            type={type} 
            value={value} 
            onChange={handleChange} 
            placeholder={placeholder} 
            className="w-full pl-12 pr-4 h-14 rounded-xl outline-none text-sm font-medium transition-all bg-slate-900/50 border border-slate-800 text-slate-100 focus:border-sky-500/50 focus:bg-slate-900/80 placeholder:text-slate-600 focus:shadow-[0_0_15px_-5px_rgba(14,165,233,0.3)]" 
          />
        </div>
      </div>
    );
};

const Card = ({ children, onClick, active = false, className = "" }) => (
  <div 
    onClick={onClick} 
    className={`relative p-6 rounded-3xl transition-all duration-300 overflow-hidden cursor-pointer border
    ${active 
        ? 'bg-sky-500/10 border-sky-500 shadow-[0_0_30px_-10px_rgba(14,165,233,0.25)]' 
        : 'glass-card border-slate-800 hover:border-slate-600 hover:bg-slate-800/50'} 
    ${className}`}
  >
    {active && <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/5 to-transparent pointer-events-none" />}
    {children}
  </div>
);

const SectionTitle = ({ title, sub, icon: Icon }) => (
    <div className="mb-6 flex items-start gap-4">
        <div className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-500 shadow-lg shrink-0">
            {Icon && <Icon size={20} />}
        </div>
        <div>
            <h2 className="text-xl font-bold text-white leading-tight">{title}</h2>
            <p className="text-sm text-slate-400">{sub}</p>
        </div>
    </div>
);

// === COMPONENTE DE REVIEWS INFINITO (CORRIGIDO) ===
const InfiniteReviews = ({ reviews }) => {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    let animationId;
    
    const scroll = () => {
      if (!isPaused) {
        if (scrollContainer.scrollLeft >= (scrollContainer.scrollWidth / 2)) {
          scrollContainer.scrollLeft = 0; // Reset suave
        } else {
          scrollContainer.scrollLeft += 0.8; // Velocidade do scroll
        }
      }
      animationId = requestAnimationFrame(scroll);
    };
    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  // Duplicamos o array para criar o efeito de loop infinito
  const loopReviews = [...reviews, ...reviews, ...reviews];

  return (
    <div className="w-full overflow-hidden py-8 border-y border-white/5 bg-slate-900/30 mb-8 relative group">
      {/* Sombras laterais para suavizar */}
      <div className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-[#020617] to-transparent z-10"></div>
      <div className="absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-[#020617] to-transparent z-10"></div>
      
      <div 
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-4 hide-scrollbar px-4"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setTimeout(() => setIsPaused(false), 2000)}
      >
        {loopReviews.map((r, i) => (
            <div key={`${i}-${r.n}`} className="min-w-[300px] bg-slate-900 p-5 rounded-3xl border border-slate-800 shrink-0 shadow-xl relative select-none">
              <Quote size={20} className="absolute top-4 right-4 text-slate-700 opacity-50"/>
              <div className="flex justify-between items-start mb-4">
                 <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sky-500 text-sm shadow-inner">{r.n.charAt(0)}</div>
                     <div>
                         <p className="text-sm font-bold text-white leading-none">{r.n}</p>
                         <p className="text-[10px] text-slate-500 uppercase mt-1 tracking-wider">{r.loc}</p>
                     </div>
                 </div>
                 <div className="flex gap-0.5 text-amber-400">
                   {[...Array(5)].map((_,k)=><Star key={k} size={12} fill={k<r.s?"currentColor":"none"} className={k<r.s?"":"text-slate-700"}/>)}
                 </div>
              </div>
              <p className="text-xs text-slate-300 italic mb-0 leading-relaxed font-light">"{r.t}"</p>
            </div>
        ))}
      </div>
    </div>
  );
};

// ==================================================================================
// 4. APLICAÇÃO PRINCIPAL
// ==================================================================================

export default function App() {
  // ESTADOS GERAIS
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState('packs');
  const [showConfetti, setShowConfetti] = useState(false);
  const [welcomePopup, setWelcomePopup] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  
  // DADOS E MEMO
  const DATA = useMemo(() => getData(), []);
  
  // REFS PARA SCROLL AUTOMÁTICO
  const heroRef = useRef(null);
  const dateRef = useRef(null);
  const locationRef = useRef(null);
  const paymentRef = useRef(null);
  const dateScrollRef = useRef(null);

  // DADOS DO USUÁRIO & AGENDAMENTO
  const [user, setUser] = useState({ name: '', xp: 0, hasSeenWelcome: false });
  const [booking, setBooking] = useState({
    type: 'single', 
    item: null, 
    extras: {}, 
    date: null, 
    time: null, 
    locationType: 'home', 
    address: { street: '', number: '', district: '', city: '', comp: '', placeName: '' },
    payment: '', 
    termsAccepted: false
  });

  // --- EFEITOS ---

  // Inicialização & Persistência
  useEffect(() => {
    setIsClient(true);
    const s = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (s) {
        try {
            const p = JSON.parse(s);
            if(p.user) setUser(p.user);
            // Recupera rascunho apenas se a data ainda for válida (futura ou hoje)
            if(p.draft && new Date(p.draft.date) >= new Date().setHours(0,0,0,0)) {
                setBooking(p.draft);
            }
        } catch(e) {}
    }
    setTimeout(() => setLoading(false), 1500);
  }, []);

  // Salvar Automático
  useEffect(() => { 
      if(isClient && !loading) localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({ user, draft: booking })); 
  }, [user, booking, isClient, loading]);

  // Scroll Automático (Waterfall)
  useEffect(() => {
      if(!loading) {
          if(booking.item && !booking.date) {
              setTimeout(() => dateRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'}), 300);
          } else if(booking.date && booking.time && !user.name) {
              setTimeout(() => locationRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'}), 300);
          }
      }
  }, [booking.item, booking.date, booking.time, loading]);

  // --- HELPERS ---
  const vibrate = () => { if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10); };
  
  const addToast = (msg, type = 'error') => {
      vibrate();
      const id = Date.now();
      setToasts(p => [...p, {id, msg, type}]);
      setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  };

  const daysArray = useMemo(() => {
      const days = [];
      const today = new Date();
      for(let i=0; i<30; i++) { 
          const d = new Date(today);
          d.setDate(today.getDate() + i);
          days.push(d);
      }
      return days;
  }, []);

  // Lógica Fast Track (11:55 -> 12:00)
  const generateTimeSlots = useMemo(() => {
      if (!booking.date) return [];
      const slots = [];
      for (let i = CONFIG.START_HOUR; i <= CONFIG.END_HOUR; i++) slots.push(`${i < 10 ? '0' : ''}${i}:00`);
      
      const now = new Date();
      const selectedDate = new Date(booking.date);
      
      if (selectedDate.getDate() === now.getDate() && selectedDate.getMonth() === now.getMonth()) {
          const currentHour = now.getHours();
          return slots.filter(time => parseInt(time) > currentHour);
      }
      return slots;
  }, [booking.date]);

  const financials = useMemo(() => {
    if (!booking.item) return { total: 0, savings: 0 };
    let total = booking.item.price;
    Object.keys(booking.extras).forEach(k => {
        if(booking.extras[k]) {
            const ex = DATA.extras.find(e=>e.id===k);
            if(ex) total += (booking.type !== 'single' ? Math.floor(ex.price * 0.8) : ex.price);
        }
    });
    return { total, savings: booking.item.savings || 0 };
  }, [booking]);

  const generateWhatsApp = () => {
      if(!booking.item || !booking.date || !booking.time || !user.name || !booking.payment || !booking.termsAccepted) {
          addToast("Preencha todos os campos!");
          return;
      }

      const dateStr = booking.date ? new Date(booking.date).toLocaleDateString('pt-BR') : '';
      const hash = btoa(`${financials.total}-${dateStr}-${CONFIG.SECRET_TOKEN}`).substring(0,6).toUpperCase();
      let loc = booking.locationType === 'home' ? `Casa` : (booking.locationType === 'hotel' ? `Hotel` : `Motel`);
      
      const msg = `*NOVO AGENDAMENTO* 🔐 #${hash}\n\n👤 *${user.name}*\n💆‍♂️ *${booking.item?.title}*\n🗓️ *${dateStr} às ${booking.time}*\n📍 *${loc}*\n💰 *R$ ${financials.total},00* (via ${booking.payment.toUpperCase()})\n\nAguardo confirmação!`;
      window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`, '_blank');
      
      const gainedXP = booking.type === 'pack' ? 150 : 50;
      setUser(u => ({ ...u, xp: u.xp + gainedXP }));
      setBooking(b => ({...b, item: null, type:'single', payment:'', termsAccepted:false}));
      setShowConfetti(true);
  };

  const ConfettiComponent = () => {
      const canvasRef = useRef(null);
      useEffect(() => {
        if(!showConfetti) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const particles = Array.from({ length: 100 }, () => ({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height - canvas.height,
          w: Math.random() * 5 + 2,
          h: Math.random() * 8 + 4,
          color: ['#0ea5e9', '#3b82f6', '#6366f1', '#ffffff'][Math.floor(Math.random() * 4)],
          speed: Math.random() * 6 + 3,
          angle: Math.random() * 360,
          spin: Math.random() * 8 - 4
        }));
        let ani;
        const draw = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          particles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle * Math.PI / 180);
            ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
            ctx.restore();
            p.y += p.speed;
            p.angle += p.spin;
          });
          ani = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(ani);
      }, [showConfetti]);
      if(!showConfetti) return null;
      return <canvas ref={canvasRef} className="fixed inset-0 z-[100] pointer-events-none" />;
  };

  // --- RENDER ---
  if (!isClient) return <div className="bg-[#020617] min-h-screen"/>;

  if (loading) return (
      <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#020617] text-white">
        <div className="relative mb-8 animate-bounce"><div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-sky-500 to-blue-700 shadow-2xl flex items-center justify-center text-4xl font-bold font-sans">TM</div></div>
        <div className="flex gap-2"><div className="w-3 h-3 bg-sky-500 rounded-full animate-bounce delay-75"></div><div className="w-3 h-3 bg-sky-500 rounded-full animate-bounce delay-150"></div><div className="w-3 h-3 bg-sky-500 rounded-full animate-bounce delay-300"></div></div>
      </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#020617] text-slate-100 font-sans selection:bg-sky-500/30">
      <GlobalStyles />
      <ConfettiComponent />
      
      {/* BACKGROUND AMBIENCE */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[-20%] w-[800px] h-[800px] bg-sky-600/10 rounded-full blur-[120px] opacity-40"></div>
          <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] opacity-40"></div>
      </div>

      {/* TOASTS */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] flex flex-col gap-3 w-full max-w-xs pointer-events-none px-4">
        {toasts.map(t => (
          <div key={t.id} className={`pointer-events-auto flex items-center gap-4 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl animate-pop ${t.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
            {t.type === 'success' ? <Check size={20} /> : <AlertTriangle size={20} />}
            <span className="text-xs font-bold">{t.msg}</span>
          </div>
        ))}
      </div>

      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full h-20 z-50 glass-panel flex items-center justify-between px-6 lg:px-12">
          <div>
              <h1 className="text-2xl font-bold tracking-tight text-white leading-none">Thalyson</h1>
              <span className="text-[10px] font-bold text-sky-500 uppercase tracking-[0.3em]">Massagens</span>
          </div>
          <div className="flex gap-2">
              <div className="px-3 py-1.5 bg-slate-800/80 rounded-xl border border-slate-700 flex items-center gap-2">
                  <Trophy size={14} className="text-amber-400"/>
                  <span className="text-xs font-bold">{user.xp} XP</span>
              </div>
          </div>
      </header>

      {/* MAIN LAYOUT (DESKTOP SPLIT / MOBILE VERTICAL) */}
      <div className="pt-28 pb-12 px-4 lg:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 relative z-10">
        
        {/* LEFT COLUMN: THE FLOW */}
        <div className="space-y-12">
            
            {/* 1. HERO & SERVICES */}
            <section ref={heroRef} className="reveal-section">
                <div className="mb-8">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">Olá, <span className="text-sky-500">{user.name ? user.name.split(' ')[0] : 'Visitante'}</span></h2>
                    <p className="text-slate-400 text-sm lg:text-base leading-relaxed">Pausa, respira e conecta. Escolha sua experiência.</p>
                </div>

                <div className="bg-slate-900/80 p-1.5 rounded-2xl grid grid-cols-2 gap-1 border border-slate-800 mb-6 w-full lg:w-96">
                    <button onClick={()=>{vibrate(); setActiveTab('packs')}} className={`py-3 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 ${activeTab==='packs' ? 'bg-slate-800 text-sky-400 shadow-md ring-1 ring-sky-500/20' : 'text-slate-500'}`}><Package size={16}/> Ciclos</button>
                    <button onClick={()=>{vibrate(); setActiveTab('single')}} className={`py-3 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 ${activeTab==='single' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500'}`}><LayoutList size={16}/> Avulso</button>
                </div>

                <div className="grid gap-6">
                    {(activeTab === 'single' ? DATA.services : DATA.plans).map(item => (
                        <Card key={item.id} active={booking.item?.id === item.id} onClick={() => { vibrate(); setBooking(b => ({ ...b, type: activeTab === 'single' ? 'single' : item.type, item })); }}>
                            {item.tag && <span className="absolute top-0 right-0 bg-sky-600 text-white text-[9px] font-bold px-3 py-1.5 rounded-bl-xl shadow-lg">{item.tag}</span>}
                            <div className="flex items-start gap-5">
                                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${booking.item?.id === item.id ? 'bg-sky-500 text-white border-sky-400' : 'bg-slate-800 text-sky-500 border-slate-700'}`}>
                                    <item.icon size={32} strokeWidth={1.5} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                                    <p className="text-sm text-slate-400 leading-snug">{item.desc}</p>
                                </div>
                            </div>
                            
                            {/* DETALHES EXPANSIVEIS SE SELECIONADO */}
                            {booking.item?.id === item.id && (
                                <div className="mt-5 pt-5 border-t border-sky-500/20 reveal-section">
                                    <div className="bg-sky-500/5 p-4 rounded-xl border border-sky-500/10 mb-4">
                                        <p className="text-xs text-sky-200 leading-relaxed whitespace-pre-line flex gap-2">
                                            <Info size={14} className="shrink-0 text-sky-500 mt-0.5"/>
                                            {item.details}
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs font-bold text-slate-500 uppercase bg-slate-900/50 px-2 py-1 rounded border border-slate-800">{item.min ? `${item.min} MIN` : 'MENSAL'}</span>
                                        <div className="text-right">
                                            {item.fullPrice && <span className="text-xs line-through text-slate-600 block">R$ {item.fullPrice}</span>}
                                            <span className="text-2xl font-bold text-sky-400">R$ {item.price}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            </section>

            {/* REVIEWS MARQUEE (INFINITE SCROLL) */}
            <section className="reveal-section">
                <InfiniteReviews reviews={DATA.reviews} />
            </section>

            {/* 2. DATA & HORA */}
            {booking.item && (
                <section ref={dateRef} className="reveal-section border-t border-white/5 pt-12">
                    <SectionTitle icon={Calendar} title="Data & Horário" sub="Quando fica melhor para você?" />
                    
                    <div className="relative group mb-8">
                        <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar snap-x -mx-4 px-4 lg:mx-0 lg:px-0">
                            {daysArray.map((d, i) => {
                                const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                                const isToday = i===0;
                                return (
                                    <button key={i} onClick={() => {vibrate(); setBooking(b => ({ ...b, date: d, time: null }))}} className={`h-24 min-w-[5.5rem] rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border-2 snap-start ${isSel ? 'bg-sky-500 border-sky-500 text-white shadow-lg scale-105' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'}`}>
                                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">{isToday ?'HOJE':d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span>
                                        <span className="text-2xl font-bold">{d.getDate()}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {booking.date ? (
                        generateTimeSlots.length > 0 ? (
                            <div className="grid grid-cols-4 lg:grid-cols-6 gap-3 reveal-section">
                                {generateTimeSlots.map((t) => (
                                    <button key={t} onClick={() => {vibrate(); setBooking(b => ({...b, time: t}))}} className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${booking.time === t ? 'bg-white text-black border-white shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'}`}>
                                        {t}
                                    </button>
                                ))}
                            </div>
                        ) : <div className="p-6 bg-slate-900/50 rounded-2xl text-center text-slate-500 border border-white/5 flex flex-col items-center gap-2"><Clock size={24}/><span>Agenda cheia para este dia.</span></div>
                    ) : <div className="p-8 text-center text-slate-600 font-medium border-2 border-dashed border-slate-800 rounded-2xl">Toque em uma data acima para ver os horários.</div>}
                </section>
            )}

            {/* 3. LOCATION & DETAILS */}
            {booking.date && booking.time && (
                <section ref={locationRef} className="reveal-section border-t border-white/5 pt-12">
                    <SectionTitle icon={MapPin} title="Localização" sub="Onde será o atendimento?" />
                    
                    <div className="grid grid-cols-3 gap-3 mb-8">
                        {[{id:'home', l:'Casa', i:Home}, {id:'motel', l:'Motel', i:BedDouble}, {id:'hotel', l:'Hotel', i:Building}].map(x => (
                            <button key={x.id} onClick={()=>{vibrate(); setBooking(b=>({...b, locationType: x.id}))}} className={`h-24 rounded-2xl text-xs font-bold uppercase flex flex-col items-center justify-center gap-3 border-2 transition-all ${booking.locationType === x.id ? 'bg-sky-500/20 border-sky-500 text-sky-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                                <x.i size={24}/> {x.l}
                            </button>
                        ))}
                    </div>
                    
                    <div className="space-y-5 mb-8">
                        <InputField label="Seu Nome" value={user.name} onChange={v=>setUser(u=>({...u, name: v}))} icon={User} placeholder="Nome/Apelido" />
                        {booking.locationType !== 'motel' && (
                            <>
                                <div className="grid grid-cols-[1fr_90px] gap-4">
                                    <InputField label={booking.locationType==='hotel'?'Hotel':'Rua'} value={booking.address.street} onChange={v=>setBooking(b=>({...b, address: {...b.address, street: v}}))} icon={booking.locationType==='hotel'?Building:MapPin} />
                                    <InputField label={booking.locationType==='hotel'?'Quarto':'Nº'} value={booking.address.number} type="tel" onChange={v=>setBooking(b=>({...b, address: {...b.address, number: v}}))} />
                                </div>
                                <InputField label={booking.locationType==='hotel'?'Cidade':'Bairro'} value={booking.address.district} onChange={v=>setBooking(b=>({...b, address: {...b.address, district: v}}))} icon={MapPin} />
                            </>
                        )}
                        {booking.locationType === 'motel' && <div className="p-4 bg-slate-900/50 rounded-xl border border-dashed border-slate-700 text-center text-sm text-slate-400">A taxa do local fica por conta do cliente.</div>}
                    </div>

                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 pl-1">Adicionais</h3>
                    <div className="space-y-3">
                        {DATA.extras.map(ex => (
                            <div key={ex.id} onClick={()=>{vibrate(); setBooking(b=>({...b, extras:{...b.extras, [ex.id]: !b.extras[ex.id]}}))}} className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${booking.extras[ex.id] ? 'bg-sky-500/10 border-sky-500' : 'bg-slate-900 border-slate-800'}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${booking.extras[ex.id] ? 'text-sky-400' : 'text-slate-600'}`}><ex.icon size={20}/></div>
                                    <span className={`font-semibold ${booking.extras[ex.id] ? 'text-white' : 'text-slate-400'}`}>{ex.label}</span>
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded ${booking.extras[ex.id] ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-500'}`}>+ R$ {ex.price}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

        </div>

        {/* RIGHT COLUMN: STICKY SUMMARY (DESKTOP) / BOTTOM SHEET (MOBILE) */}
        <div className="lg:block">
            <div className="sticky top-24 space-y-6">
                
                {/* CARD DE RESUMO FLUTUANTE */}
                <div ref={paymentRef} className="glass-panel p-6 rounded-3xl relative overflow-hidden border border-white/10 shadow-2xl">
                     <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600"></div>
                     <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Ticket className="text-sky-500"/> Resumo</h3>
                     
                     {booking.item ? (
                         <div className="space-y-4 reveal-section">
                             <div className="flex justify-between items-start pb-4 border-b border-white/10">
                                 <div>
                                     <p className="font-bold text-white">{booking.item.title}</p>
                                     <p className="text-xs text-slate-400 mt-1">{booking.date ? new Date(booking.date).toLocaleDateString('pt-BR') : 'Selecione a data'} • {booking.time || '--:--'}</p>
                                 </div>
                                 <p className="font-bold text-white">R$ {booking.item.price}</p>
                             </div>
                             
                             {Object.keys(booking.extras).filter(k=>booking.extras[k]).length > 0 && (
                                 <div className="space-y-2 pb-4 border-b border-white/10">
                                     {Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k=>(
                                         <div key={k} className="flex justify-between text-xs text-sky-300">
                                             <span>+ {DATA.extras.find(e=>e.id===k).label}</span>
                                             <span>R$ {DATA.extras.find(e=>e.id===k).price}</span>
                                         </div>
                                     ))}
                                 </div>
                             )}

                             <div className="flex justify-between items-end pt-2">
                                 <span className="text-xs font-bold uppercase text-slate-500">Total Final</span>
                                 <span className="text-4xl font-bold text-white tracking-tight">R$ {financials.total}</span>
                             </div>

                             {/* PAGAMENTO */}
                             {user.name && booking.time && (
                                 <div className="pt-6 reveal-section">
                                     <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-3">Forma de Pagamento</h4>
                                     <div className="space-y-2">
                                         {[{id:'pix', l:'PIX (CNPJ)', i:QrCode}, {id:'money', l:'Dinheiro', i:Banknote}, {id:'card', l:'Cartão', i:CreditCard}].map(p => (
                                             <button key={p.id} onClick={()=>{vibrate(); setBooking(b=>({...b, payment: p.id}))}} className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${booking.payment === p.id ? 'bg-sky-500/20 border-sky-500 text-sky-400' : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:bg-slate-800'}`}>
                                                 <div className="flex items-center gap-3"><p.i size={18}/><span className="text-sm font-medium">{p.l}</span></div>
                                                 {booking.payment === p.id && <Check size={16}/>}
                                             </button>
                                         ))}
                                     </div>

                                     {booking.payment === 'pix' && (
                                         <div className="mt-4 p-4 bg-slate-900 rounded-xl border border-dashed border-slate-700 reveal-section">
                                             <p className="text-[10px] text-center text-slate-500 mb-2 uppercase font-bold">Chave CNPJ</p>
                                             <div className="flex gap-2">
                                                 <div className="flex-1 bg-black/30 rounded-lg flex items-center justify-center text-sm font-mono text-white border border-white/5">{CONFIG.PIX_DISPLAY}</div>
                                                 <button onClick={()=>{navigator.clipboard.writeText(CONFIG.PIX_KEY); vibrate(); addToast("Chave Copiada!", "success")}} className="h-10 w-10 bg-slate-800 rounded-lg flex items-center justify-center text-white border border-slate-700 active:bg-sky-500"><Copy size={16}/></button>
                                             </div>
                                         </div>
                                     )}

                                     <label className="flex items-start gap-3 mt-6 cursor-pointer opacity-80 hover:opacity-100">
                                         <input type="checkbox" checked={booking.termsAccepted} onChange={e=>setBooking(b=>({...b, termsAccepted: e.target.checked}))} className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-800 accent-sky-500 shrink-0"/>
                                         <span className="text-xs text-slate-400 leading-snug">Concordo com os termos de higiene, segurança e cancelamento.</span>
                                     </label>

                                     <Button full variant="whatsapp" size="lg" className="mt-6" onClick={generateWhatsApp}>
                                         CONFIRMAR AGENDAMENTO
                                     </Button>
                                 </div>
                             )}
                         </div>
                     ) : (
                         <div className="text-center py-12 text-slate-600 border-2 border-dashed border-slate-800 rounded-2xl">
                             <p className="text-sm">Selecione um serviço para começar.</p>
                         </div>
                     )}
                </div>
            </div>
        </div>

      </div>

      {showConfetti && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md reveal-section">
             <div className="text-center">
                 <div className="h-32 w-32 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_60px_-10px_rgba(16,185,129,0.6)] mb-8 mx-auto animate-bounce">
                     <Check size={64} className="text-white" strokeWidth={4}/>
                 </div>
                 <h2 className="text-4xl font-bold text-white mb-4">Sucesso!</h2>
                 <p className="text-slate-300 text-lg mb-8">Redirecionando para o WhatsApp...</p>
             </div>
          </div>
      )}

    </div>
  );
}
