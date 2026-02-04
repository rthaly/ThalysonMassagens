import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Ticket, Flame, Wind, 
  Clock, Zap, X, Globe, Building, BedDouble, 
  Heart, Instagram, Moon, Sun, Home, 
  CreditCard, Banknote, QrCode, Trophy, Info, Gift, 
  ChevronLeft, ChevronRight, Loader2, ShieldCheck, AlertTriangle, Tag, Sparkles, 
  MapPin, Calendar, Smartphone, Crown, LayoutList, Package, 
  Lock, User, Quote, Share2, ExternalLink, Copy
} from 'lucide-react';

/**
 * ==================================================================================
 * THALYSON APP OS v41.0 - VERTICAL COMPLETE EDITION
 * ==================================================================================
 * 1. DESIGN: Vertical Flow (Mobile First), Blue Glass Theme, Fonte Poppins.
 * 2. CONTEÚDO: 100% Restaurado (Reviews, Descrições detalhadas, Termos).
 * 3. LÓGICA: Agendamento imediato (Hora atual permitida), Persistência Local.
 * 4. PAGAMENTO: CNPJ Pix 62.922.530/0001-44.
 */

const CONFIG = {
  PHONE: "5517991360413", 
  INSTAGRAM_URL: "https://instagram.com/thalyson.massagens", 
  STORAGE_KEY: '@thaly_app_v41_complete', 
  PIX_KEY: "62922530000144",
  PIX_DISPLAY: "62.922.530/0001-44",
  SECRET_TOKEN: 'VERTICAL_COMPLETE_2026',
  START_HOUR: 9,
  END_HOUR: 20
};

// ==================================================================================
// 1. ESTILOS GLOBAIS (POPPINS & GLASSMORPHISM)
// ==================================================================================
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
    
    body, button, input, textarea { font-family: 'Poppins', sans-serif; }
    
    /* Efeito de Vidro Profundo */
    .glass-panel {
      background: rgba(13, 18, 30, 0.7);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    
    .glass-card {
      background: linear-gradient(180deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%);
      border: 1px solid rgba(255, 255, 255, 0.05);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    }

    .hide-scrollbar::-webkit-scrollbar { display: none; }
    
    /* Animações de Entrada */
    .animate-enter { animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
    .animate-pop { animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
    
    @keyframes slideUpFade {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes popIn {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }
  `}</style>
);

// ==================================================================================
// 2. COMPONENTES UI (RESPONSIVOS)
// ==================================================================================

const Button = ({ children, onClick, variant = 'primary', size = 'md', disabled = false, full = false, icon: Icon, className = '', loading = false }) => {
  const baseStyle = "relative flex items-center justify-center font-semibold tracking-wide transition-all duration-200 active:scale-[0.96] rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-sky-500 text-white shadow-sky-500/30 hover:bg-sky-400 border-t border-white/20",
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

const Confetti = ({ active }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!active || typeof window === 'undefined') return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 6 + 2,
      h: Math.random() * 10 + 4,
      color: ['#0ea5e9', '#3b82f6', '#6366f1', '#ffffff'][Math.floor(Math.random() * 4)],
      speed: Math.random() * 8 + 4,
      angle: Math.random() * 360,
      spin: Math.random() * 10 - 5
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
  }, [active]);
  if (!active) return null;
  return <canvas ref={canvasRef} className="fixed inset-0 z-[100] pointer-events-none" />;
};

const AutoScrollReviews = ({ reviews }) => {
  return (
    <div className="w-full overflow-hidden py-8 border-y border-white/5 bg-slate-900/20 mb-8">
      <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar px-4 snap-x">
        {[...reviews, ...reviews, ...reviews].map((r, i) => (
            <div key={i} className="min-w-[280px] md:min-w-[320px] bg-slate-900 p-5 rounded-3xl border border-slate-800 snap-center shrink-0 shadow-xl">
              <div className="flex justify-between items-start mb-4">
                 <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sky-500 text-xs">{r.n.charAt(0)}</div>
                     <div>
                         <p className="text-sm font-bold text-white leading-none">{r.n}</p>
                         <p className="text-[10px] text-slate-500 uppercase mt-0.5">{r.loc}</p>
                     </div>
                 </div>
                 <div className="flex gap-0.5 text-amber-400">
                   {[...Array(5)].map((_,k)=><Star key={k} size={12} fill={k<r.s?"currentColor":"none"} className={k<r.s?"":"text-slate-700"}/>)}
                 </div>
              </div>
              <p className="text-xs text-slate-300 italic mb-0 leading-relaxed">"{r.t}"</p>
            </div>
        ))}
      </div>
    </div>
  );
};

// ==================================================================================
// 3. BASE DE DADOS COMPLETA (RICH CONTENT)
// ==================================================================================

const getData = () => {
    return {
        // SERVIÇOS COMPLETOS
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
        // PLANOS E CICLOS COMPLETOS
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
        // ADICIONAIS COMPLETOS
        extras: [
            { id: 'more_time', price: 55, icon: Clock, label: "+30 Minutos", desc: "Para não ter pressa." },
            { id: 'touch', price: 55, icon: Heart, label: "Interatividade", desc: "Você toca também." },
            { id: 'aroma', price: 5, icon: Wind, label: "Aromaterapia", desc: "Essência no ar." }
        ],
        // AVALIAÇÕES REAIS COMPLETAS
        reviews: [
            { n: "Bruno", loc: "SP - Bela Vista", t: "Thalyson, quero dizer que sua massagem foi muito bem executada. Você primeiro conhece o corpo para ir executando o procedimento com muito cuidado e segurança.", s: 5 },
            { n: "Tiago", loc: "SP - Bela Vista", t: "O Thalyson tem uma energia surreal. A massagem foi perfeita, melhor da minha vida.", s: 5 },
            { n: "Ricardo M.", loc: "Rio Preto", t: "Mão firme. Consegui relaxar de verdade, coisa que não fazia há tempos.", s: 5 },
            { n: "André L.", loc: "SP - Bela Vista", t: "O toque dele é diferente. Me senti muito à vontade.", s: 5 },
            { n: "Gustavo", loc: "Santa Fé do Sul", t: "Gostei muito da energia, pessoa do bem. Recomendo.", s: 4 },
            { n: "Renato", loc: "SP - Centro", t: "Muito respeitoso e profissional. A sensitiva é uma experiência única.", s: 5 },
            { n: "Pedro", loc: "Rio Preto", t: "A energia do corpo a corpo é intensa. Me senti renovado.", s: 5 }
        ],
        // TERMOS E AVISOS
        terms: [
            "1. HIGIENE: Um banho prévio ajuda no nosso conforto.",
            "2. SIGILO: Sua privacidade é absoluta comigo.",
            "3. AMBIENTE: Adapto o atendimento ao seu espaço (Cama/Sofá).",
            "4. RESPEITO: Um espaço livre de julgamentos.",
            "5. SAÚDE: Confirmo que estou saudável e sem sintomas."
        ]
    };
};

// ==================================================================================
// 4. APLICAÇÃO PRINCIPAL
// ==================================================================================

export default function App() {
  // ESTADOS
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0); 
  const [activeTab, setActiveTab] = useState('packs');
  const [isClient, setIsClient] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [welcomePopup, setWelcomePopup] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  
  const scrollRef = useRef(null);
  const dateScrollRef = useRef(null);
  const DATA = useMemo(() => getData(), []);

  // DADOS DO USUÁRIO & AGENDAMENTO
  const [user, setUser] = useState({ name: '', xp: 0, hasSeenWelcome: false });
  const [booking, setBooking] = useState({
    type: 'single', item: null, extras: {}, date: null, time: null, locationType: 'home', 
    address: { street: '', number: '', district: '', city: '', comp: '', placeName: '' },
    payment: '', termsAccepted: false
  });

  // --- INICIALIZAÇÃO & PERSISTÊNCIA ---
  useEffect(() => {
    setIsClient(true);
    // Recupera dados do LocalStorage
    const s = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (s) {
        try {
            const p = JSON.parse(s);
            if(p.user) setUser(p.user);
            // Recupera rascunho apenas se a data ainda for válida (futura ou hoje)
            if(p.draft && new Date(p.draft.date) >= new Date().setHours(0,0,0,0)) {
                setBooking(p.draft);
                if(p.step) setStep(p.step);
            }
        } catch(e) {}
    }
    setTimeout(() => setLoading(false), 1500);
  }, []);

  // Salva dados automaticamente a cada mudança
  useEffect(() => { 
      if(isClient && !loading) localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({ user, draft: booking, step })); 
  }, [user, booking, step, isClient, loading]);

  // Popup de Boas-vindas na primeira visita
  useEffect(() => {
      if(!loading && isClient && !user.hasSeenWelcome) setTimeout(() => setWelcomePopup(true), 2500);
  }, [loading, isClient]);

  // Scroll suave para o topo ao mudar de passo
  useEffect(() => { if(scrollRef.current) scrollRef.current.scrollTo({top:0, behavior:'smooth'}); }, [step]);

  // --- UTILITÁRIOS ---
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

  // LÓGICA FAST TRACK (11:55 -> 12:00)
  const generateTimeSlots = useMemo(() => {
      if (!booking.date) return [];
      const slots = [];
      for (let i = CONFIG.START_HOUR; i <= CONFIG.END_HOUR; i++) slots.push(`${i < 10 ? '0' : ''}${i}:00`);
      
      const now = new Date();
      const selectedDate = new Date(booking.date);
      
      // Se for hoje, filtra o passado
      if (selectedDate.getDate() === now.getDate() && selectedDate.getMonth() === now.getMonth()) {
          const currentHour = now.getHours();
          // Permite horários futuros (ex: se são 11h, mostra 12h, 13h...)
          return slots.filter(time => parseInt(time) > currentHour);
      }
      return slots;
  }, [booking.date]);

  const financials = useMemo(() => {
    if (!booking.item) return { total: 0, sub: 0 };
    let sub = booking.item.price;
    Object.keys(booking.extras).forEach(k => {
        if(booking.extras[k]) {
            const ex = DATA.extras.find(e=>e.id===k);
            if(ex) sub += (booking.type !== 'single' ? Math.floor(ex.price * 0.8) : ex.price);
        }
    });
    return { total: sub };
  }, [booking]);

  const generateWhatsApp = () => {
      const dateStr = booking.date ? new Date(booking.date).toLocaleDateString('pt-BR') : '';
      // Hash de Segurança
      const hash = btoa(`${financials.total}-${dateStr}-${CONFIG.SECRET_TOKEN}`).substring(0,6).toUpperCase();
      
      let loc = "";
      if(booking.locationType === 'home') loc = `Casa: ${booking.address.street}, ${booking.address.number} - ${booking.address.district}`;
      else if(booking.locationType === 'hotel') loc = `Hotel: ${booking.address.placeName}, Quarto ${booking.address.comp}`;
      else loc = "Motel (Local por conta do cliente)";

      const extrasTxt = Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k => `+ ${DATA.extras.find(e=>e.id===k).label}`).join('\n');

      const msg = `*SOLICITAÇÃO DE AGENDAMENTO* 🔐 #${hash}\n\n👤 *Cliente:* ${user.name}\n💆‍♂️ *Serviço:* ${booking.item?.title}\n🗓️ *Data:* ${dateStr} às ${booking.time}\n📍 *Local:* ${loc}\n\n${extrasTxt ? `✨ *Extras:*\n${extrasTxt}\n` : ''}💰 *Valor Final:* R$ ${financials.total},00\n💳 *Pagamento:* ${booking.payment.toUpperCase()}\n\nAguardo confirmação!`;
      
      window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`, '_blank');
      
      // Add XP
      const gained = booking.type === 'pack' ? 150 : 50;
      setUser(u => ({ ...u, xp: u.xp + gained }));
      
      setBooking(b => ({...b, item: null, type:'single', payment:'', termsAccepted:false}));
      setShowConfetti(true);
      setStep(4);
  };

  // --- SCROLL DATE HELPER ---
  const scrollDate = (dir) => {
      if(dateScrollRef.current) dateScrollRef.current.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
  };

  // --- RENDER ---
  if (!isClient) return <div className="bg-slate-950 min-h-screen"/>;

  if (loading) return (
      <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-slate-950 text-white font-sans">
        <div className="relative mb-8 animate-bounce">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-sky-500 to-blue-700 shadow-2xl flex items-center justify-center text-4xl font-bold">TM</div>
        </div>
        <div className="flex gap-2">
            <div className="w-3 h-3 bg-sky-500 rounded-full animate-bounce delay-75"></div>
            <div className="w-3 h-3 bg-sky-500 rounded-full animate-bounce delay-150"></div>
            <div className="w-3 h-3 bg-sky-500 rounded-full animate-bounce delay-300"></div>
        </div>
      </div>
  );

  return (
    <div className="h-[100dvh] w-full bg-slate-950 text-slate-100 flex flex-col font-sans overflow-hidden">
      <GlobalStyles />
      <Confetti active={showConfetti} />

      {/* TOASTS */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] flex flex-col gap-3 w-full max-w-xs pointer-events-none px-4">
        {toasts.map(t => (
          <div key={t.id} className={`pointer-events-auto flex items-center gap-4 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl animate-pop ${t.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
            {t.type === 'success' ? <Check size={20} /> : <AlertTriangle size={20} />}
            <span className="text-xs font-bold">{t.msg}</span>
          </div>
        ))}
      </div>

      {/* HEADER (Gaussian Blur) */}
      <header className="fixed top-0 left-0 w-full h-20 z-50 glass-panel border-b-0 border-b-white/5 flex items-center justify-between px-6">
          <div>
              <h1 className="text-xl font-bold tracking-tight text-white leading-none">Thalyson</h1>
              <span className="text-[10px] font-bold text-sky-500 uppercase tracking-[0.3em]">Massagens</span>
          </div>
          <div className="flex gap-2">
              <div className="px-3 py-1 bg-slate-800 rounded-lg border border-slate-700 flex items-center gap-2">
                  <Trophy size={14} className="text-amber-400"/>
                  <span className="text-xs font-bold">{user.xp} XP</span>
              </div>
          </div>
      </header>

      {/* MAIN CONTENT */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden pt-24 pb-32 px-4 scroll-smooth">
        <div className="max-w-md mx-auto space-y-8 animate-enter">

          {/* STEP 0: CATALOGO & HOME */}
          {step === 0 && (
            <>
              <div className="space-y-2">
                  <h2 className="text-3xl font-semibold text-white">Olá, <span className="text-sky-500">{user.name ? user.name.split(' ')[0] : 'Visitante'}</span></h2>
                  <p className="text-slate-400 text-sm leading-relaxed">Escolha como quer relaxar hoje.</p>
              </div>

              {/* Toggle Tabs */}
              <div className="bg-slate-900 p-1.5 rounded-2xl grid grid-cols-2 gap-1 border border-slate-800 shadow-inner">
                  <button onClick={()=>{vibrate(); setActiveTab('packs')}} className={`py-3 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 ${activeTab==='packs' ? 'bg-slate-800 text-sky-400 shadow-md ring-1 ring-sky-500/20' : 'text-slate-500'}`}><Package size={16}/> Ciclos</button>
                  <button onClick={()=>{vibrate(); setActiveTab('single')}} className={`py-3 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 ${activeTab==='single' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500'}`}><LayoutList size={16}/> Avulso</button>
              </div>

              <div className="grid gap-6">
                  {(activeTab === 'single' ? DATA.services : DATA.plans).map(item => (
                      <Card key={item.id} onClick={() => { vibrate(); setBooking(b => ({ ...b, type: activeTab === 'single' ? 'single' : item.type, item })); setStep(1); }}>
                          {item.tag && <span className="absolute top-0 right-0 bg-sky-600 text-white text-[9px] font-bold px-3 py-1.5 rounded-bl-xl shadow-lg">{item.tag}</span>}
                          <div className="flex items-start gap-5">
                              <div className="h-16 w-16 rounded-2xl bg-slate-800 flex items-center justify-center text-sky-500 shrink-0 border border-slate-700">
                                  <item.icon size={32} strokeWidth={1.5} />
                              </div>
                              <div className="flex-1">
                                  <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                                  <p className="text-sm text-slate-400 leading-snug">{item.desc}</p>
                              </div>
                          </div>
                          
                          {/* DETALHES RICOS */}
                          <div className="mt-5 pt-5 border-t border-white/5">
                              <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5 mb-4">
                                  <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-line flex gap-2">
                                      <Info size={14} className="shrink-0 text-sky-500 mt-0.5"/>
                                      {item.details}
                                  </p>
                              </div>
                              <div className="flex justify-between items-end">
                                  <span className="text-xs font-bold text-slate-500 uppercase bg-slate-900 px-2 py-1 rounded border border-slate-800">{item.min ? `${item.min} MIN` : 'MENSAL'}</span>
                                  <div className="text-right">
                                      {item.fullPrice && <span className="text-xs line-through text-slate-600 block">R$ {item.fullPrice}</span>}
                                      <span className="text-2xl font-bold text-sky-400">R$ {item.price}</span>
                                  </div>
                              </div>
                          </div>
                      </Card>
                  ))}
              </div>
              
              <AutoScrollReviews reviews={DATA.reviews} />
            </>
          )}

          {/* STEP 1: DATA E HORA */}
          {step === 1 && (
            <div className="space-y-8 animate-enter">
               <div className="text-center">
                   <h2 className="text-2xl font-bold text-white">Quando?</h2>
                   <p className="text-slate-400 text-sm">Selecione data e horário.</p>
               </div>

               <div className="relative group">
                   <button onClick={() => scrollDate('left')} className="hidden md:flex absolute -left-12 top-1/2 -translate-y-1/2 p-2 bg-slate-800 rounded-full text-white"><ChevronLeft/></button>
                   <div ref={dateScrollRef} className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar snap-x -mx-4 px-4">
                       {daysArray.map((d, i) => {
                           const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                           const isToday = i===0;
                           return (
                               <button key={i} onClick={() => {vibrate(); setBooking(b => ({ ...b, date: d, time: null }))}} className={`h-24 min-w-[5rem] rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border-2 snap-start ${isSel ? 'bg-sky-500 border-sky-500 text-white shadow-lg scale-105' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                                   <span className="text-[10px] font-bold uppercase tracking-wider">{isToday ?'HOJE':d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span>
                                   <span className="text-2xl font-bold">{d.getDate()}</span>
                               </button>
                           )
                       })}
                   </div>
                   <button onClick={() => scrollDate('right')} className="hidden md:flex absolute -right-12 top-1/2 -translate-y-1/2 p-2 bg-slate-800 rounded-full text-white"><ChevronRight/></button>
               </div>

               {booking.date ? (
                   generateTimeSlots.length > 0 ? (
                       <div className="grid grid-cols-4 gap-3 animate-pop">
                           {generateTimeSlots.map((t) => (
                               <button key={t} onClick={() => {vibrate(); setBooking(b => ({...b, time: t}))}} className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${booking.time === t ? 'bg-white text-black border-white shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'}`}>
                                   {t}
                               </button>
                           ))}
                       </div>
                   ) : <div className="p-6 bg-slate-900 rounded-2xl text-center text-slate-500 border border-white/5 flex flex-col items-center gap-2"><Clock size={24}/><span>Agenda cheia para este dia.</span></div>
               ) : <div className="p-8 text-center text-slate-600 font-medium border-2 border-dashed border-slate-800 rounded-2xl">Toque em uma data acima para ver os horários.</div>}
            </div>
          )}

          {/* STEP 2: LOCAL E DADOS */}
          {step === 2 && (
             <div className="space-y-8 animate-enter">
                 <h2 className="text-2xl font-bold text-center text-white">Localização</h2>
                 <div className="grid grid-cols-3 gap-3">
                     {[{id:'home', l:'Casa', i:Home}, {id:'motel', l:'Motel', i:BedDouble}, {id:'hotel', l:'Hotel', i:Building}].map(x => (
                         <button key={x.id} onClick={()=>{vibrate(); setBooking(b=>({...b, locationType: x.id}))}} className={`h-24 rounded-2xl text-xs font-bold uppercase flex flex-col items-center justify-center gap-3 border-2 transition-all ${booking.locationType === x.id ? 'bg-sky-500/20 border-sky-500 text-sky-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                             <x.i size={24}/> {x.l}
                         </button>
                     ))}
                 </div>
                 
                 <div className="space-y-5">
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

                 <div className="pt-6 border-t border-white/5">
                     <h3 className="text-xs font-bold text-slate-500 uppercase mb-4">Turbine sua sessão</h3>
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
                 </div>
             </div>
          )}

          {/* STEP 3: CHECKOUT & PIX */}
          {step === 3 && (
             <div className="space-y-6 animate-enter">
                 <div className="text-center">
                     <h2 className="text-2xl font-bold text-white">Resumo</h2>
                     <p className="text-slate-400 text-sm">Confira os detalhes.</p>
                 </div>

                 <div className="glass-panel p-6 rounded-3xl relative overflow-hidden">
                     <div className="relative z-10">
                         <h3 className="text-2xl font-bold text-white mb-1">{booking.item?.title}</h3>
                         <p className="text-sky-400 font-medium mb-6 flex items-center gap-2"><Calendar size={16}/> {new Date(booking.date).toLocaleDateString('pt-BR')} às {booking.time}</p>
                         
                         <div className="space-y-3 border-t border-white/10 pt-4 mb-6">
                             <div className="flex justify-between text-sm text-slate-300"><span>Valor Base</span><span>R$ {booking.item?.price}</span></div>
                             {Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k=>(
                                 <div key={k} className="flex justify-between text-sm text-slate-400"><span>+ {DATA.extras.find(e=>e.id===k).label}</span><span>R$ {DATA.extras.find(e=>e.id===k).price}</span></div>
                             ))}
                         </div>
                         <div className="flex justify-between items-end">
                             <span className="text-xs font-bold uppercase text-slate-500">Total</span>
                             <span className="text-4xl font-bold text-white">R$ {financials.total}</span>
                         </div>
                     </div>
                 </div>

                 <div className="space-y-3">
                     <h3 className="text-xs font-bold text-slate-500 uppercase ml-1">Pagamento</h3>
                     {[{id:'pix', l:'PIX (CNPJ)', i:QrCode}, {id:'money', l:'Dinheiro', i:Banknote}, {id:'card', l:'Cartão', i:CreditCard}].map(p => (
                         <button key={p.id} onClick={()=>{vibrate(); setBooking(b=>({...b, payment: p.id}))}} className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${booking.payment === p.id ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                             <div className="flex items-center gap-3"><p.i size={20}/><span className="font-semibold">{p.l}</span></div>
                             {booking.payment === p.id && <div className="h-5 w-5 bg-emerald-500 rounded-full flex items-center justify-center"><Check size={12} className="text-black"/></div>}
                         </button>
                     ))}
                 </div>

                 {booking.payment === 'pix' && (
                     <div className="p-5 bg-slate-900 rounded-2xl border border-dashed border-slate-700 animate-enter">
                         <p className="text-xs text-center text-slate-500 mb-3 uppercase font-bold">Chave CNPJ</p>
                         <div className="flex gap-2">
                             <div className="flex-1 bg-black/30 rounded-xl flex items-center justify-center text-lg font-mono text-white border border-white/5">{CONFIG.PIX_DISPLAY}</div>
                             <button onClick={()=>{navigator.clipboard.writeText(CONFIG.PIX_KEY); vibrate(); addToast("Chave Copiada!", "success")}} className="h-12 w-12 bg-slate-800 rounded-xl flex items-center justify-center text-white border border-slate-700 active:bg-sky-500"><Copy size={20}/></button>
                         </div>
                     </div>
                 )}

                 <div className="pt-4 space-y-4">
                     {/* TERMOS EXPANDIDOS */}
                     <div className="bg-slate-900/30 rounded-xl p-4 border border-white/5">
                         <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={()=>setTermsOpen(!termsOpen)}>
                             <span className="text-xs font-bold text-slate-500 uppercase">Termos de Serviço</span>
                             <Info size={14} className="text-slate-500"/>
                         </div>
                         {termsOpen && (
                             <div className="text-[10px] text-slate-400 space-y-2 mt-2 animate-enter">
                                 {DATA.terms.map((t,i)=><p key={i}>{t}</p>)}
                             </div>
                         )}
                     </div>

                     <label className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 cursor-pointer">
                         <input type="checkbox" checked={booking.termsAccepted} onChange={e=>setBooking(b=>({...b, termsAccepted: e.target.checked}))} className="h-6 w-6 rounded-md border-slate-600 bg-slate-800 accent-sky-500 shrink-0"/>
                         <span className="text-xs text-slate-400 leading-snug">Li e aceito os termos acima.</span>
                     </label>
                 </div>
             </div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 4 && (
             <div className="flex flex-col items-center justify-center pt-20 text-center animate-enter px-6">
                 <div className="h-28 w-28 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_50px_-10px_rgba(16,185,129,0.5)] mb-8">
                     <Check size={56} className="text-white" strokeWidth={3}/>
                 </div>
                 <h2 className="text-3xl font-bold text-white mb-3">Tudo Certo!</h2>
                 <p className="text-slate-400 mb-10 max-w-[250px]">Seu pré-agendamento foi gerado. Finalize no WhatsApp para confirmar.</p>
                 <Button variant="secondary" full onClick={()=>{setStep(0); setBooking({...booking, item:null, type:'single', payment:'', termsAccepted:false})}}>Voltar ao Início</Button>
             </div>
          )}

        </div>
      </main>

      {/* FOOTER ACTION (Gaussian Blur) */}
      {step < 4 && (
          <div className="fixed bottom-0 left-0 w-full p-4 glass-panel border-t-0 border-t-white/10 z-50">
              <div className="max-w-md mx-auto flex gap-3">
                  {step > 0 && <Button variant="secondary" size="icon" icon={ChevronLeft} onClick={()=>{vibrate(); setStep(step-1)}} />}
                  <Button full variant={step===3 ? 'whatsapp' : 'primary'} size="lg" onClick={()=>{
                      vibrate();
                      if(step===0 && !booking.item) return addToast("Selecione um serviço");
                      if(step===1 && (!booking.date || !booking.time)) return addToast("Selecione data e hora");
                      if(step===2 && !user.name) return addToast("Preencha seu nome");
                      if(step===3) {
                          if(!booking.payment) return addToast("Selecione o pagamento");
                          if(!booking.termsAccepted) return addToast("Aceite os termos");
                          generateWhatsApp();
                      } else {
                          setStep(step+1);
                      }
                  }}>
                      {step === 3 ? 'FINALIZAR NO WHATSAPP' : 'CONTINUAR'}
                  </Button>
              </div>
          </div>
      )}

      {/* POPUP WELCOME */}
      {welcomePopup && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
              <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={()=>setWelcomePopup(false)}></div>
              <div className="relative glass-card p-8 rounded-3xl text-center max-w-sm w-full animate-enter border-sky-500/30">
                  <div className="h-16 w-16 bg-gradient-to-tr from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl rotate-3">
                      <Gift size={32} className="text-white"/>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Bem-vindo!</h2>
                  <p className="text-sm text-slate-400 mb-6 leading-relaxed">Ganhe XP a cada agendamento e troque por sessões gratuitas no futuro.</p>
                  <Button full onClick={()=>{setWelcomePopup(false); setUser(u=>({...u, hasSeenWelcome:true}))}}>Começar</Button>
              </div>
          </div>
      )}
    </div>
  );
}
